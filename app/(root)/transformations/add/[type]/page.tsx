import { SearchParamProps, TransformationTypeKey } from '@/types';
import { transformationTypes } from '@/constants';

import Header from '@/components/shared/Header';
import TransformationForm from '@/components/shared/TransformationForm';
import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

async function TransformationsAddTypePage({
  params: { type }
}: SearchParamProps) {
  const { userId } = auth();

  if (!userId) redirect('/sign-in');

  const user = await getUserById(userId);

  const transformation = transformationTypes[type];
  const { title, subtitle } = transformation;

  return (
    <>
      <Header {...{ title, subtitle }} />

      <section className="mt-10">
        <TransformationForm
          action="Add"
          userId={user._id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  );
}

export default TransformationsAddTypePage;
