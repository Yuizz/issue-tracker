import { Lock, LockOpen, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { type Project } from '@prisma/client';
import { RelativeTimeElement } from '@github/relative-time-element';
import ProjectFormModal from './ProjectFormModal';
import DeleteProjectModal from './DeleteProjectModal';
import { Chip } from '@nextui-org/react';

type Props = {
  project: Project & {
    pendingIssues: number,
    lastActivity: Date
  }
  isEditable?: boolean
  userId?: string
}

function ProjectCard({ project, isEditable = false, userId }: Props) {

  if (!window.customElements.get('relative-time')) {
    window.customElements.define('relative-time', RelativeTimeElement);
  }

  return (
    <div className="flex w-full min-h-20 flex-col rounded-md border border-neutral-200 p-3 shadow-sm dark:border-neutral-800">
      <div className="mb-1 flex w-full items-center justify-between space-x-2">
        <Link
          href={`/projects/${project.slug}`}
          className="block  space-x-[1px] overflow-hidden truncate font-medium transition-opacity duration-75 hover:opacity-80"
        >
          <span>{project.name}</span>
        </Link>
        <div className="flex items-center space-x-3">
          <p className="text-sm text-gray">{`${project.pendingIssues} pending issues`}</p>
          {isEditable && <>
            <ProjectFormModal
              userId={userId}
              initialData={{
                id: project.id,
                name: project.name,
                description: project.description,
                isPublic: project.isPublic
              }} isIconOnly />
            <DeleteProjectModal projectId={project.id} projectName={project.name} isIconOnly />
          </>
          }
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p
          className="mb-2 line-clamp-2 h-[2.5rem] overflow-hidden font-mono text-sm text-neutral-500 dark:text-neutral-400"
          title={"Description"}
        >
          {project.description}
        </p>
        <div className="flex justify-between">
          <div>
            {project.isPublic ? (
              <Chip color="primary" startContent={<LockOpen size={15} />} size="sm">public</Chip>
            )
              : (
                <Chip color="warning" startContent={<Lock size={15} />} size="sm">private</Chip>
              )
            }
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-200 font-light">
            <relative-time datetime={project.lastActivity.toISOString()} />
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard