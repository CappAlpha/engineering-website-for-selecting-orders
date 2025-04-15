import s from './page.module.scss';

export default function ProductPage({ params: { id } }: Readonly<{ params: { id: string } }>) {
  return (
    <div className={s.root}>Product {id}</div>
  );
};