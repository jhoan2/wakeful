import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

export default function AdminUpdateTag() {
    const [addDeleteToUpdate, setAddDeleteToUpdate] = useState(false)
    const childObj = z.object({
        name: z.string().trim().min(2).max(240),
        tagId: z.string().trim().min(2)
    })

    const formSchema = z.object({
        tagId: z.optional(z.string().trim().min(2).max(240)),
        tagName: z.optional(z.string().trim().min(2).max(240)),
        parent: z.optional(z.string().trim().min(2).max(240)),
        value: z.number().optional(),
        children: z.array(childObj).optional()
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            children: [
                {
                    childTagName: '',
                    id: ''
                }
            ],
            parent: '',
            tagId: '',
            tagName: '',
            tagTree: '',
            value: 1000
        }
    })

    const { fields, append, remove } = useFieldArray({
        name: 'children',
        control: form.control
    })

    const ADMIN_UPDATE_IDEALITE_TAG = gql`
    mutation adminUpdateIdealiteTag ($input: UpdateIdealiteTagInput!) {
        updateIdealiteTag(input: $input) {
          document {
            children {
              name
              tagId
            }
            createdAt
            deleted
            id
            name
            parent
            tagTree
            value
          }
        }
      }
    `
    const [adminUpdateIdealiteTag, { data: adminUpdateTagData, error: adminUpdateTagError }] = useMutation(ADMIN_UPDATE_IDEALITE_TAG);

    const onSubmit = (values) => {
        let tagContent = {
            children: values.children,
            name: values.tagName,
            parent: values.parent,
            updatedAt: new Date().toISOString(),
            value: values.value
        }

        if (addDeleteToUpdate) {
            tagContent.deleted = true
        }

        for (const key in tagContent) {
            if (tagContent[key] === undefined || tagContent[key] === null || tagContent[key] === "") {
                delete tagContent[key];
            }
        }

        adminUpdateIdealiteTag({
            variables: {
                input: {
                    id: values.tagId,
                    content: tagContent
                }
            }
        })

        if (adminUpdateTagError) {
            toast.error('Error updating tag')
            console.log(adminUpdateTagError.message)
        }

        if (adminUpdateTagData) {
            toast.success('Updated Tag')
            console.log(adminUpdateTagData.updateIdealiteTag.document)
        }
    }

    return (
        <div className='border-2 border-amber-200 p-3'>
            <p className='text-xl'>Update Tag</p>
            <Button variant='outline' onClick={() => setAddDeleteToUpdate(!addDeleteToUpdate)}>
                Add Delete: {addDeleteToUpdate.toString()}
            </Button>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="tagId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tag Id</FormLabel>
                                <FormControl>
                                    <Input placeholder="Tag Id" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tagName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="parent"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Parent Id</FormLabel>
                                <FormControl>
                                    <Input placeholder="id" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Value"
                                        {...field}
                                        onChange={event => field.onChange(+event.target.value)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {
                        fields.map((field, index) => {
                            return (<div key={field.id}>
                                <FormField
                                    control={form.control}
                                    name={`children.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Child Tag Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="child tag name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`children.${index}.tagId`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Id</FormLabel>
                                            <FormControl>
                                                <Input placeholder="id" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button variant='secondary' className='text-red-500' onClick={() => remove(index)}>Delete</Button>
                            </div>
                            )
                        })
                    }
                    <div className='flex justify-between space-x-2'>
                        <Button variant='secondary' onClick={() => append({ childTagName: '', id: '' })}>Append</Button>
                        <Button variant='secondary' onClick={() => form.reset()}>Reset</Button>
                        <Button type="submit" variant='secondary'>Submit</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
