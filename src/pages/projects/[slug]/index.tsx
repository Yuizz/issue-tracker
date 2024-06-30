import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import React, { type ReactElement } from 'react'
import type { NextPageWithLayout } from '~/pages/_app';
import { api } from '~/utils/api';
import Layout from './layout';
import Overview from '~/components/projects/view/Overview';
import ProjectNotFound from '~/components/projects/ProjectNotFound';
import { Accordion, AccordionItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import IssuesTable from '~/components/issues/IssuesTable';

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
  const project = api.projects.getBySlug.useQuery({ slug });
  const issues = api.issues.getByProject.useQuery({ slug });


  if (project.isInitialLoading || issues.isInitialLoading) {
    return <div className="flex justify-center py-40"><Spinner label="Loading project..." /></div>;
  }

  if (!project.data) {
    return <div className="flex justify-center py-20">
      <ProjectNotFound />
    </div>;
  }



  return (
    <main className="py-16 px-32">
      <section>
        <div>{project.data?.name}</div>
        <Overview name={project.data?.name || ''} />
      </section>
      <div className="py-10">
        <Accordion
          selectionMode="multiple"
          defaultExpandedKeys={["pending"]}
          showDivider={false}>
          <AccordionItem
            key="pending"
            aria-label="Pending issues"
            title="Pending"
            subtitle={`${(issues.data?.pending.length || "0")} issues`}>
            <div className="flex justify-center px-2">
              {issues.data?.pending && issues.data.pending.length === 0 && <p className="text-gray-600">No issues</p>}
              {issues.data?.pending && issues.data.pending.length > 0 && <IssuesTable issues={issues.data?.pending} />}
            </div>
          </AccordionItem>

          <AccordionItem key="done" title="Completed" subtitle={`${issues.data?.done?.length || 0} issues`}>
            <div className="flex justify-center px-2">
              {issues.data?.done && issues.data.done.length === 0 && <p className="text-gray-600">No issues</p>}
              {issues.data?.done && issues.data.done.length > 0 && <IssuesTable issues={issues.data?.done} />}
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  )
}

Index.getLayout = function getLayour(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Index
