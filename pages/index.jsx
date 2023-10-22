import { useEffect, useState } from 'react';
import { useCeramicContext } from '../context';

import Head from 'next/head'

import AuthPrompt from "../components/did-select-popup";
import React from "react";
import { authenticateCeramic } from "../utils";

const Home = () => {
  const clients = useCeramicContext()
  const { ceramic, composeClient } = clients
  const [newPost, setNewPost] = useState('')
  const [posts, setPosts] = useState([])

  const createPost = async () => {
    if (ceramic.did !== undefined) {
      const profile = await composeClient.executeQuery(`
        query {
          viewer {
            basicProfile {
              id
              name
            }
          }
        }
      `)
      if (profile && profile.data?.viewer.basicProfile?.name) {
        const post = await composeClient.executeQuery(`
        mutation {
          createPosts(input: {
            content: {
              body: """${newPost}"""
              created: "${new Date().toISOString()}"
              profileId: "${profile.data.viewer.basicProfile.id}"
            }
          })
          {
            document {
              body
            }
          }
        }
      `)
        getPosts()
        setNewPost('')
        alert("Created post.")
      } else {
        alert("Failed to fetch profile for authenticated user. Please register a profile.");
      }
    }
  }
  const getPosts = async () => {
    const profile = await composeClient.executeQuery(`
        query {
          viewer {
            id
            basicProfile {
              id
              name
              username
              emoji
            }
          }
        }
      `);
    localStorage.setItem("viewer", profile?.data?.viewer?.id)

    const following = await composeClient.executeQuery(`
      query {
        node(id: "${localStorage.getItem('viewer')}") {
          ...on CeramicAccount {
            followingList(last:300) {
              edges {
                node {
                  profile {
                    id
                    username
                    name
                    emoji
                    posts(last:30) {
                      edges {
                        node {
                          id
                          body
                          created
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `)
    const explore = await composeClient.executeQuery(`
      query {
        postsIndex(last:300) {
          edges {
            node {
              id
              body
              created
              profile{
                id
                name
                username
                emoji
              }
            }
          }
        }
      }
    `)

    // TODO: Sort based off of "created date"
    const posts = []

    if (following.data !== undefined) {
      following.data?.node?.followingList.edges.map(profile => {
        if (profile.node !== null) {
          profile.node.profile.posts.edges.map(post => {
            if (post.node !== null) {
              posts.push({
                author: {
                  id: profile.node.profile.id,
                  name: profile.node.profile.name,
                  username: profile.node.profile.username,
                  emoji: profile.node.profile.emoji
                },
                post: {
                  id: post.node.id,
                  body: post.node.body,
                  created: post.node.created
                }
              })
            }
          })
        }
      })
    } else {
      explore.data?.postsIndex?.edges.map(post => {
        posts.push({
          author: {
            id: post.node.profile.id,
            name: post.node.profile.name,
            username: post.node.profile.username,
            emoji: post.node.profile.emoji
          },
          post: {
            id: post.node.id,
            body: post.node.body,
            created: post.node.created
          }
        })
      })
    }
    posts.sort((a, b) => (new Date(b.created) - new Date(a.created)))
    console.log(posts)
    setPosts((posts?.reverse())) // reverse to get most recent msgs
  }

  const createProfile = async () => {
    if (ceramic.did !== undefined) {
      const profile = await composeClient.executeQuery(`
            query {
              viewer {
                id
              }
            }
          `)
      if (profile && profile.data?.viewer.id) {
        const post = await composeClient.executeQuery(`
            mutation {
              createIcarusProfile(input: {
                content: {
                  bio: "something"
                  createdAt: "${new Date().toISOString()}"
                  updatedAt: "${new Date().toISOString()}"
                  displayName: "jhoang2"
                }
              })
              {
                document {
                  id
                  displayName
                }
              }
            }
          `)
        console.log(post)
      } else {
        console.log("Failed to fetch profile for authenticated user. Please register a profile.");
      }
    } else {
      console.log("user is not authenticated")
    }
  }

  const createSettings = async () => {
    if (ceramic.did !== undefined) {
      const profile = await composeClient.executeQuery(`
            query {
              viewer {
                id
              }
            }
          `)
      if (profile && profile.data?.viewer.id) {
        const post = await composeClient.executeQuery(`
            mutation CreateNewSettings {
              createSettings(input: {
                content: {
                  createdAt: "${new Date().toISOString()}", 
                  updatedAt: "${new Date().toISOString()}"},
                  clientMutationId: "k2t6wzhkhabz194pty7mrk7s3r4gxuhn9y9xukegmjlxjditr7kbbrmdgalrql"
              }) {
                document {
                  createdAt
                }
              }
            }
          `)
        console.log(post)
      } else {
        console.log("Failed to fetch profile for authenticated user. Please register a profile.");
      }
    } else {
      console.log("user is not authenticated")
    }
  }



  // useEffect(() => {
  //   getPosts()
  // }, [])

  return (
    <>
      <Head>
        <title>Ceramic Social</title>
        {/* TODO: UPDATE FAVICON */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="content">
        <div>
          <textarea
            value={newPost}
            maxLength={100}
            placeholder="What are we thinking about?"
            onChange={(e) => {
              setNewPost(e.target.value)
            }}
          />
          <button onClick={() => { createPost() }}>
            Share
          </button>
          <button onClick={() => { createProfile() }}>Create Profile</button>

        </div>
      </div>
    </>
  );
}

export default Home