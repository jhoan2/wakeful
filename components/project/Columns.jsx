import { Loader, Square, CheckSquare2, Archive, XSquare, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProjectActions from "./ProjectActions";
import ProjectTag from "./ProjectTag";

export const Columns = [
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const status = row.getValue("status")
            switch (status) {
                case 'TODO':
                    return (
                        <div className="flex items-center w-24 font-medium justify-around">
                            <Square />{status}
                        </div>
                    )
                case 'DOING':
                    return (
                        <div className="flex items-center w-24 font-medium justify-around">
                            <Loader />{status}
                        </div>
                    )
                case 'DONE':
                    return (
                        <div className="flex items-center w-24 font-medium justify-around">
                            <CheckSquare2 />{status}
                        </div>
                    )
                case 'DROPPED':
                    return (
                        <div className="flex items-center w-24 font-medium justify-around">
                            <XSquare />{status}
                        </div>
                    )
                case 'ARCHIVED':
                    return (
                        <div className="flex items-center w-24 font-medium justify-around">
                            <Archive />{status}
                        </div>
                    )
            }
        }
    },
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const title = row.getValue("title")
            const id = row.original.id
            return (
                <Link key={id} id={id} href={`/projects/${encodeURIComponent(id)}`} >
                    <Button variant='secondary'>
                        {title}
                    </Button>
                </Link>
            )
        }
    },
    {
        accessorKey: "priority",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Priority
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const priority = row.getValue("priority")
            return (
                <div className={`
                    w-24 
                    font-medium 
                    text-center
                    ${priority === 'HIGH' ? 'text-red-300' : ''}
                    ${priority === 'MEDIUM' ? 'text-orange-300' : ''}
                    ${priority === 'LOW' ? 'text-green-300' : ''}
                `}>
                    {priority}
                </div>
            )
        }
    },
    {
        accessorKey: "tags",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tags
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const tags = row.getValue("tags")
            return (
                <ProjectTag tags={tags} />
            )
        }
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const rowDate = row.getValue("createdAt")
            const localeCreatedAt = new Date(rowDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
            return <div className="text-right font-medium">{localeCreatedAt}</div>
        }
    },
    {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => {
            const rowDate = row.getValue("updatedAt")
            const localeUpdatedAt = new Date(rowDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
            return <div className="text-right font-medium">{localeUpdatedAt}</div>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const projectId = row.original.id
            const projectTitle = row.original.title
            return <ProjectActions projectId={projectId} projectTitle={projectTitle} />
        },
    },
]
