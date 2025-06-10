import cn from "classnames";
import Link from "next/link";
import { type FC } from "react";

import {
  Envelope,
  Phone,
  PostalAddress,
  Telegram,
  Vk,
  WhatsApp,
} from "../../../../public/icon";
import { Button } from "../Button";
import { FooterSubscribeForm } from "./FooterSubscribeForm";

import s from "./Footer.module.scss";

interface Props {
  isCatalogPage?: boolean;
}

export const Footer: FC<Props> = ({ isCatalogPage = false }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn(s.root, isCatalogPage && s.catalog)}>
      <div className={s.wrap}>
        <div className={s.main}>
          <div className={s.company}>
            <h3 className={s.title}>ENGINEER</h3>
            <p className={s.description}>
              Профессиональные инженерные решения для ваших проектов. Мы
              специализируемся на проектировании и реализации комплексных
              технических задач с 2010 года.
            </p>
          </div>

          <div className={s.services}>
            <h4 className={s.subtitle}>Наши услуги</h4>
            <ul className={s.list}>
              <li>
                <Link href="/">Проектирование</Link>
              </li>
              <li>
                <Link href="/">Инженерный консалтинг</Link>
              </li>
              <li>
                <Link href="/">Строительный надзор</Link>
              </li>
              <li>
                <Link href="/">Автоматизация процессов</Link>
              </li>
              <li>
                <Link href="/">Техническая экспертиза</Link>
              </li>
            </ul>
          </div>

          <div className={s.links}>
            <h4 className={s.subtitle}>Полезная информация</h4>
            <ul className={s.list}>
              <li>
                <Link href="/">О компании</Link>
              </li>
              <li>
                <Link href="/">Портфолио проектов</Link>
              </li>
              <li>
                <Link href="/">Сертификаты и лицензии</Link>
              </li>
              <li>
                <Link href="/">Блог</Link>
              </li>
              <li>
                <Link href="/">Вакансии</Link>
              </li>
            </ul>
          </div>

          <div className={s.contact}>
            <h4 className={s.subtitle}>Контакты</h4>
            <ul className={s.listContact}>
              <li>
                <PostalAddress className={s.icon} />
                <span>ул. Инженерная, 123, г. Москва, 123456</span>
              </li>
              <li>
                <Phone className={s.icon} />
                <span>
                  <Link href="tel:+74951234567">+7 (495) 123-45-67</Link>
                </span>
              </li>
              <li>
                <Envelope className={s.icon} />
                <span>
                  <Link href="mailto:info@engproject.ru">info@engeneer.ru</Link>
                </span>
              </li>
            </ul>

            <div className={s.socialIcons}>
              <Button
                href="/"
                className={s.socialBtn}
                color="transparent"
                noPadding
                aria-label="Vk"
              >
                <Vk className={s.socialIcon} />
              </Button>
              <Button
                href="/"
                className={s.socialBtn}
                color="transparent"
                noPadding
                aria-label="Telegram"
              >
                <Telegram className={s.socialIcon} />
              </Button>
              <Button
                href="/"
                className={s.socialBtn}
                color="transparent"
                noPadding
                aria-label="WhatsApp"
              >
                <WhatsApp className={s.socialIcon} />
              </Button>
            </div>
          </div>
        </div>

        <div className={s.subscribe}>
          <div className={s.subscribeWrap}>
            <h4 className={s.subtitle}>Подпишитесь на новости и обновления</h4>
            <p className={s.subscribeDescription}>
              Будьте в курсе последних новостей и специальных предложений
            </p>
            <FooterSubscribeForm />
          </div>
        </div>

        <div className={s.bottom}>
          <div className={s.copyright}>
            &copy; {currentYear} Engineer. Все права защищены.
          </div>
          <div className={s.legalLinks}>
            <Link href="/">Условия использования</Link>
            <Link href="/">Политика конфиденциальности</Link>
            <Link href="/">Политика cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
