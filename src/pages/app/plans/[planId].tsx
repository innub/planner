import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import { getServerSession } from 'next-auth';
import superjson from 'superjson';

import Planner from '@/components/planner/Planner';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { createContextInner } from '@/server/trpc/context';
import { appRouter } from '@/server/trpc/router/_app';
import usePlan from '@/components/planner/usePlan';
import { trpc } from '@/utils/trpc';
import { SemestersContextProvider } from '@/components/planner/SemesterContext';

/**
 * A page that displays the details of a specific student academic plan.
 */
export default function PlanDetailPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
): JSX.Element {
  const { planId } = props;
  const planQuery = trpc.plan.getPlanById.useQuery(planId);

  const { plan, validation, prereqData, bypasses, isPlanLoading, handlePlanDelete } = usePlan({ planId });

  // console.log(courseData);
  // Indicate UI loading
  if (isPlanLoading) {
    return <div>Loading</div>;
  }

  return (
    <div className="flex h-screen max-h-screen w-screen flex-col overflow-hidden">
      {plan && validation && (
        <SemestersContextProvider planId={planId} plan={plan} bypasses={bypasses ?? []}>
          <Planner degreeRequirements={validation} transferCredits={plan.transferCredits} prereqData={prereqData} />
        </SemestersContextProvider>
      )}
      {/* <button onClick={handlePlanDelete}>Delete</button> */}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext<{ planId: string }>) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session }),
    transformer: superjson,
  });

  const planId = context.params?.planId as string;

  // await ssg.courses.publicGetSanitizedCourses.prefetch();
  await ssg.plan.getPlanById.prefetch(planId);
await ssg.validator.validatePlan.prefetch(planId);
  return {
    props: {
      trpcState: ssg.dehydrate(),
      planId,
    },
  };
}

PlanDetailPage.auth = true;
