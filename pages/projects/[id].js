import React, { useState } from 'react'
import { useRouter } from 'next/router';
import ProjectAddNote from '../../components/project/ProjectAddNote';
import { useCeramicContext } from '../../context';
import { Button } from "@/components/ui/button";

export default function ProjectPage() {
    const clients = useCeramicContext()
    const { composeClient, ceramic } = clients
    const [showProjectModal, setShowProjectModal] = useState(false)
    const router = useRouter()
    const projectId = router.query.id

    return (
        <div>
            <Button variant='secondary' onClick={() => setShowProjectModal(true)}>Add Note</Button>
            {showProjectModal ?
                <ProjectAddNote projectId={projectId} setShowProjectModal={setShowProjectModal} />
                :
                null
            }
        </div>
    )
}
