import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import React, { type ReactElement } from 'react'
import type { NextPageWithLayout } from '~/pages/_app';
import { api } from '~/utils/api';
import Layout from './layout';
import ProjectNotFound from '~/components/projects/ProjectNotFound';
import { Accordion, AccordionItem, Skeleton, Spinner } from '@nextui-org/react';
import styles from "./styles.module.css"
import IssuesTable from '~/components/issues/IssuesTable';
import IssueModal from '~/components/issues/IssueModal';
import ProjectFormModal from '~/components/projects/ProjectFormModal';
import { useSession } from 'next-auth/react';

export function getServerSideProps(
  context: GetServerSidePropsContext<{ slug: string }>
) {
  const slug = context.params?.slug as string;

  return {
    props: {
      slug,
    },
  };
}

type PageWithLayoutType = NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>>

const Index: PageWithLayoutType = ({ slug }) => {
  const projectQuery = api.projects.getBySlug.useQuery({ slug });
  const issues = api.issues.getByProject.useQuery({ slug });
  const { data: session } = useSession()


  if (projectQuery.isInitialLoading) {
    return <div className="flex justify-center py-40"><Spinner label="Loading project..." /></div>;
  }

  if (!projectQuery.data) {
    return <div className="flex justify-center py-20">
      <ProjectNotFound />
    </div>;
  }

  const { project, isUserAssigned, canUserEdit } = projectQuery.data

  return (
    <main className="md:py-16 md:px-32 px-4 py-4">
      <section className='flex flex-col-reverse md:flex-row'>
        <div className='grow flex flex-col gap-1 py-4'>
          <h2 className='font-bold text-xl'>{project.name}</h2>
          <p>{project.description}</p>
        </div>
        {canUserEdit && (
          <div className='flex justify-end'>
            <ProjectFormModal
              userId={session?.user.id}
              initialData={{
                id: project.id,
                name: project.name,
                description: project.description as string,
                isPublic: project.isPublic
              }} />
          </div>
        )}
      </section>
      <section className='flex flex-col gap-2'>
        {isUserAssigned && (
          <div className='fixed bottom-4 right-4'>
            <IssueModal projectId={project.id} />
          </div>
        )}
        <Skeleton isLoaded={!issues.isInitialLoading} className='rounded-lg'>
          <div className="py-10">
            <Accordion
              isCompact={true}
              selectionMode="multiple"
              defaultExpandedKeys={["pending"]}
              className="custom-accordion"
              showDivider={false}>
              <AccordionItem
                key="pending"
                aria-label="Pending issues"
                title="Pending"
                className="border-2 border-gray-200 rounded-lg p-4 mb-4"
                subtitle={`${(issues.data?.pending.length || "0")} issues`}>
                <div className="flex justify-center px-2">
                  {issues.data?.pending && issues.data.pending.length === 0 && <p className="text-gray-600">No issues</p>}
                  {issues.data?.pending && issues.data.pending.length > 0 && <IssuesTable issues={issues.data?.pending} />}
                </div>
              </AccordionItem>

              <AccordionItem
                className="border-2 border-gray-200 rounded-lg p-4"
                key="done" title="Completed" subtitle={`${issues.data?.done?.length || 0} issues`}>
                <div className="flex justify-center px-2">
                  {issues.data?.done && issues.data.done.length === 0 && <p className="text-gray-600">No issues</p>}
                  {issues.data?.done && issues.data.done.length > 0 && <IssuesTable issues={issues.data?.done} />}
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        </Skeleton>
      </section>
    </main>
  )
}

Index.getLayout = function getLayour(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Index
