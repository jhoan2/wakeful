import React from 'react';
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

export default function AdminCreateTag() {
    const childObj = z.object({
        childTagName: z.string().trim().min(2).max(240),
        id: z.string().trim().min(2)
    })

    const formSchema = z.object({
        tagName: z.string().trim().min(2).max(240),
        parent: z.optional(z.string().trim().min(2).max(240)),
        value: z.number().optional(),
        children: z.array(childObj).optional()
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tagName: '',
            parent: '',
            value: 0,
            children: [
                {
                    childTagName: '',
                    id: ''
                }
            ]
        }
    })

    const { fields, append, remove } = useFieldArray({
        name: 'children',
        control: form.control
    })

    const CREATE_IDEALITE_TAG = gql`
    mutation CreateIdealiteTagv1 ($input: CreateIdealiteTagv1Input!) {
        createIdealiteTagv1(input: $input) {
          document {
            id
            name
          }
        }
      }
    `
    const [createIdealiteTag, { data: createRootTagData, error: createRootTagError }] = useMutation(CREATE_IDEALITE_TAG);

    const onSubmit = (values) => {
        let tagContent = {
            createdAt: new Date().toISOString(),
            children: [],
            deleted: false,
            name: values.tagName,
            parent: values.parent,
            updatedAt: new Date().toISOString(),
            value: values.value
        }

        for (const key in tagContent) {
            if (tagContent[key] === undefined || tagContent[key] === null || tagContent[key] === "") {
                delete tagContent[key];
            }
        }

        createIdealiteTag({
            variables: {
                input: {
                    content: tagContent
                }
            }
        })

        if (createRootTagError) {
            toast.error('Error creating root tag')
            console.log(createRootTagError.message)
        }

        if (createRootTagData) {
            console.log(createRootTagData.createIdealiteTagv1.document)
            toast.success('Created Tag')
        }
    }

    return (
        <div className='border-2 border-amber-200 p-3'>
            <p className='text-xl'>Create Tag</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="tagName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} autoComplete='off' />
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
                                    <Input placeholder="id" {...field} autoComplete='off' />
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
                                        type='number'
                                        {...field}
                                        onChange={event => field.onChange(+event.target.value)}
                                        autoComplete='off'
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
                                    name={`children.${index}.childTagName`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Child Tag Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="child tag name" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`children.${index}.id`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Id</FormLabel>
                                            <FormControl>
                                                <Input placeholder="id" {...field} autoComplete='off' />
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
        </div >
    )
}
