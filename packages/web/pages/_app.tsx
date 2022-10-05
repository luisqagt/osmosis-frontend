import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css"; // some styles overridden in globals.css
import Head from "next/head";
import type { AppProps } from "next/app";
import { useEffect, useMemo } from "react";
import { enableStaticRendering } from "mobx-react-lite";
import { ToastContainer, Bounce } from "react-toastify";
import { StoreProvider } from "../stores";
import { MainLayout, MainLayoutMenu } from "../components/layouts";
import { TempBanner } from "../components/alert/temp-banner";
import { OgpMeta } from "../components/ogp-meta";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { GetKeplrProvider } from "../hooks";
import { IbcNotifier } from "../stores/ibc-notifier";
import {
  AmplitudeEvent,
  EventName,
  IS_FRONTIER,
  PromotedLBPPoolIds,
} from "../config";
import { useAmplitudeAnalytics } from "../hooks/use-amplitude-analytics";
import {
  setDefaultLanguage,
  setLanguage,
  setTranslations,
  useTranslation,
} from "react-multi-lang";

import en from "../localizations/en.json";
import "../localizations/dayjs-locale-en.js";
import fr from "../localizations/fr.json";
import "../localizations/dayjs-locale-fr.js";
import { Formatted } from "../components/localization";

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(utc);
enableStaticRendering(typeof window === "undefined");

const SUPPORTED_LANGUAGES = ["en", "fr"];
const DEFAULT_LANGUAGE = "en";
setTranslations({ en, fr });
setDefaultLanguage(DEFAULT_LANGUAGE);

function MyApp({ Component, pageProps }: AppProps) {
  const t = useTranslation();
  const menus = useMemo(() => {
    let m: MainLayoutMenu[] = [
      {
        label: t("menu.swap"),
        link: "/",
        icon: IS_FRONTIER ? "/icons/trade-white.svg" : "/icons/trade.svg",
        iconSelected: "/icons/trade-white.svg",
        selectionTest: /\/$/,
      },
      {
        label: t("menu.pools"),
        link: "/pools",
        icon: IS_FRONTIER ? "/icons/pool-white.svg" : "/icons/pool.svg",
        iconSelected: "/icons/pool-white.svg",
        selectionTest: /\/pools/,
      },
      {
        label: t("menu.assets"),
        link: "/assets",
        icon: IS_FRONTIER ? "/icons/asset-white.svg" : "/icons/asset.svg",
        iconSelected: "/icons/asset-white.svg",
        selectionTest: /\/assets/,
      },
    ];

    if (PromotedLBPPoolIds.length > 0) {
      menus.push({
        label: "Bootstrap",
        link: "/bootstrap",
        icon: "/icons/pool-white.svg",
        selectionTest: /\/bootstrap/,
      });
    }

    m.push(
      {
        label: t("menu.stake"),
        link: "https://wallet.keplr.app/chains/osmosis",
        icon: "/icons/ticket-white.svg",
        amplitudeEvent: [EventName.Sidebar.stakeClicked] as AmplitudeEvent,
      },
      {
        label: t("menu.vote"),
        link: "https://wallet.keplr.app/chains/osmosis?tab=governance",
        icon: "/icons/vote-white.svg",
        amplitudeEvent: [EventName.Sidebar.voteClicked] as AmplitudeEvent,
      },
      {
        label: t("menu.info"),
        link: "https://info.osmosis.zone",
        icon: "/icons/chart-white.svg",
        amplitudeEvent: [EventName.Sidebar.infoClicked] as AmplitudeEvent,
      }
    );

    return m;
  }, [t]);

  // Localization
  useEffect(() => {
    // get user language from navigator
    let navigatorLanguage = window.navigator.language;
    // formats can get: 'en-US', 'fr-FR', 'en-FR', 'fr', 'en', ...
    let userLanguage = SUPPORTED_LANGUAGES.find((language) =>
      navigatorLanguage.includes(language)
    );
    // default language is en, change only if it's different
    if (userLanguage && userLanguage != DEFAULT_LANGUAGE) {
      dayjs.locale(userLanguage);
      setLanguage(userLanguage);
    }
  }, []);
  useAmplitudeAnalytics({ init: true });

  return (
    <GetKeplrProvider>
      <StoreProvider>
        <Head>
          {/* metamask Osmosis app icon */}
          <link
            rel="shortcut icon"
            href={`${
              typeof window !== "undefined" ? window.origin : ""
            }/osmosis-logo-wc.png`}
          />
        </Head>
        <OgpMeta />
        <IbcNotifier />
        {IS_FRONTIER && (
          <TempBanner
            localStorageKey="show_frontier_banner"
            title={t("app.banner.title")}
            message={
              <>
                <Formatted
                  translationKey="app.banner.linkText"
                  components={{
                    "<text>": <></>,
                    "<link>": (
                      <a
                        className="items-center underline"
                        href="https://app.osmosis.zone/"
                        target="_self"
                      />
                    ),
                  }}
                />
              </>
            }
          />
        )}
        <ToastContainer
          toastStyle={{
            backgroundColor: IS_FRONTIER ? "#2E2C2F" : "#2d2755",
          }}
          transition={Bounce}
        />
        <MainLayout menus={menus}>
          <Component {...pageProps} />
        </MainLayout>
      </StoreProvider>
    </GetKeplrProvider>
  );
}

export default MyApp;
