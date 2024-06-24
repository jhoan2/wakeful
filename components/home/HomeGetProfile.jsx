import React from 'react'
import { useQuery, gql, useMutation } from '@apollo/client';
import { useProfileContext, useCeramicContext } from '../../context';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';

export default function GetProfile() {
  const { setProfile } = useProfileContext();
  const clients = useCeramicContext()
  const { composeClient } = clients
  const { address } = useAccount()
  const GET_USER_PROFILE = gql`
    query getUserProfile ($where: IdealiteStatsv1ObjectFilterInput = {}) {
        viewer {
          id
          idealiteProfilev1 {
            id
            avatarCid
            bio
            displayName
            farcasterId
            favorites {
              id
              title
            }
            tags
          }
        }
        idealiteStatsv1Index(first: 10, filters: {where: $where}) {
          edges {
              node {
              id
              cardsReviewed
              }
          }
        }
      }
    `
  const updateProfile = (data) => {
    const shallowCopy = Object.assign({}, data.viewer.idealiteProfilev1)
    if (data?.viewer.idealiteProfilev1.tags) {
      shallowCopy.tags = JSON.parse(shallowCopy.tags)
    }

    if (data?.viewer.idealiteProfilev1.favorites === null) {
      shallowCopy.favorites = []
    }
    setProfile(shallowCopy)
  }

  const CREATE_CARD = gql`
  mutation createnCard($input: CreateIdealiteCardv1Input = {content: {}}) {
    createIdealiteCardv1(input: $input) {
      document {
        id
      }
    }
  }
  `

  const [createCard] = useMutation(CREATE_CARD, {
    onError: (error) => {
      console.log(error.message)
    }
  });

  const UPDATE_CARD = gql`
  mutation updateCard($input: UpdateIdealiteCardv1Input!) {
      updateIdealiteCardv1(input: $input) {
        document {
          id
        }
      }
    }
  `

  const [updateCard] = useMutation(UPDATE_CARD, {
    onError: (error) => {
      console.log(error.message)
    }
  });

  const CREATE_ACCOUNT_RESOURCE = gql`
  mutation createAccountResource($input: CreateIdealiteAccountResourcesInput!) {
    createIdealiteAccountResources(input: $input) {
      document {
        id
      }
    }
  }
    `

  const [createAccountResource] = useMutation(CREATE_ACCOUNT_RESOURCE, {
    onError: (error) => {
      console.log(error.message)
    }
  });

  const updateCards = async (cid, idealiteStatsId) => {
    let usersCards = []
    let newCards = []
    let newAccountResource = []
    const existingCards = await fetch(`https://purple-defensive-anglerfish-674.mypinata.cloud/ipfs/${cid}`).then(res => res.json());

    existingCards.forEach((card) => {
      if (card.account.id === composeClient.id) {
        usersCards.push(card)
      } else {
        newCards.push(card)
        newAccountResource.push(card)
      }
    })

    const createPromises = newCards.map(card =>
      createCard({
        variables: {
          input: {
            content: {
              resourceId: card.resourceId,
              annotation: card.annotation,
              cid: card.cid,
              lastReviewed: new Date().toISOString(),
              learningStatus: 'FORGETTING',
              timesForgotten: 0,
              url: card.url,
              //This is here since the user is copying someone else's card. 
              originalAuthorDid: card.account.id,
              deleted: false
            }
          }
        }
      })
    );

    const createAccountResourcePromises = newAccountResource.map(card =>
      createAccountResource({
        variables: {
          input: {
            content: {
              createdAt: new Date().toISOString(),
              readingStatus: 'READING',
              recipient: composeClient.id,
              resourceId: card.resourceId,
              updatedAt: new Date().toISOString(),
              url: card.url,
            }
          }
        }
      })
    );



    const updatePromises = usersCards.map(card =>
      updateCard({
        variables: {
          input: {
            id: card.id,
            content: {
              lastReviewed: card.lastReviewed,
              learningStatus: card.learningStatus,
              timesForgotten: card.timesForgotten,
              url: card.url,
            }
          }
        }
      })
    );

    try {
      const res = await Promise.allSettled([...createPromises, ...updatePromises, ...createAccountResourcePromises]);

      res.forEach((result) => {
        if (result.status !== 'fulfilled') {
          throw new Error('Error updating idealite stats at home get profile')
        }
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_RESOURCE_URL}/api/idealiteStats`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardsReviewed: 'updated',
          cardsReviewedSaved: cid,
          idealiteStatsId: idealiteStatsId
        }),
      })

      if (!response.ok) {
        throw new Error('Error with updating idealite stats after updating cards')
      }

      console.log(response)
      toast.success('Successfully updated.')
    } catch (error) {
      toast.error('Something went wrong with updating cards reviewed.')
      console.error('Error executing batch mutations:', error.message);
    }
  }



  const { error: getUserProfileError } = useQuery(GET_USER_PROFILE, {
    variables: {
      where: {
        publicKey: {
          equalTo: address
        }
      }
    },
    onCompleted: (data) => {
      if (!data.idealiteStatsv1Index.edges[0].node.cardsReviewed || data.idealiteStatsv1Index.edges[0].node.cardsReviewed === 'updated') {
        return
      } else {
        updateCards(data.idealiteStatsv1Index.edges[0].node.cardsReviewed, data.idealiteStatsv1Index.edges[0].node.id)
      }
      if (!data.viewer?.idealiteProfilev1) return
      updateProfile(data)
    }
  });

  if (getUserProfileError) {
    console.log('Error: ' + getUserProfileError.message)
  }

  return (
    <></>
  )
}
