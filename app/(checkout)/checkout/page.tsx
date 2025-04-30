import s from "./page.module.scss";

export default async function Home() {
  return (
    <>
      <div className={s.wrap}>
        <h1 className={s.title}>Checkout</h1>
      </div>
    </>
  );
}
