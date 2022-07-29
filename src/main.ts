import { createApp, reactive } from "vue";
import App from "./App.vue";
import "./tailwind.css";
import Router from "./router/router";
import Store from "./store";

// Strapi Query Client //
import { ErrorResponse as TError, Session } from "./models/custom";
import Strapi, { StrapiAuthenticationData, StrapiUser } from "strapi-sdk-js";
import { QueryKey } from "react-query/types/core";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
  VueQueryPlugin,
} from "vue-query";
import {
  ApplicationSession,
  ApplicationSessionEntityResponseCollection,
} from "./models/types";
import { ResponseType } from "axios";

export const strapi = new Strapi({
  store: {
    key: "strapi_jwt",
    useLocalStorage: false,
    cookieOptions: { path: "/" },
  },
  url: "https://api.bergflix.de/",
  prefix: "/api",
});

function useStrapiMutationQuery<T>({ mutationKey }: any) {
  return strapi
    .update(
      mutationKey[0],
      mutationKey[1],
      mutationKey[2],
	  mutationKey[3]
    )
    .then((res) => {
      return res.data as T;
    });
}

function useStrapiQuery<T>({ queryKey }: any) {
  return strapi
    .find(queryKey[0], queryKey[1] ? queryKey[1] : {})
    .then((res) => {
      return res.data as T;
    });
}

function useStrapiQueryOne<T>({ queryKey }: any) {
  return strapi
    .findOne(queryKey[0], queryKey[1], queryKey[2] ? queryKey[2] : {})
    .then((res) => {
      return res.data as T;
    });
}

export function useStrapiSession(
  queryKey: [string],
  options?: Omit<
    UseQueryOptions<Session, TError, Session, QueryKey>,
    "queryFn" | "queryKey"
  >
) {
  return reactive(
    useQuery<Session, TError>(queryKey, getStrapiSesson, options)
  );
}
function getStrapiSesson({ queryKey }: any) {
  return strapi
    .request("POST", "/current-session?populate=*", {
      data: {
        identifier: queryKey[0],
      },
    })
    .then((res: any) => {
      return res;
    });
}

export const strapiLogout = () => {
  strapi.logout();
};

export const strapiLogin = () => {
  return useMutation((authData: StrapiAuthenticationData) =>
    strapi.login(authData)
  );
};

export function useStrapi<T>(
  queryKey: any[],
  options?: Omit<
    UseQueryOptions<T, TError, T, QueryKey>,
    "queryFn" | "queryKey"
  >
) {
  return reactive(useQuery<T, TError>(queryKey, useStrapiQuery, options));
}

export function useStrapiOne<T>(
  queryKey: QueryKey,
  options?: Omit<
    UseQueryOptions<T, TError, T, QueryKey>,
    "queryFn" | "queryKey"
  >
) {
  return reactive(useQuery<T, TError>(queryKey, useStrapiQueryOne, options));
}

export function getUser() {
  return reactive(
    useQuery<StrapiUser, TError>(
      "user",
      async () => {
        const user: StrapiUser = await strapi.fetchUser();
        if (!user) {
          throw new Error("User not logged in");
        }
        return user;
      },
      {
        retry: false,
      }
    )
  );
}

export function useStrapiMutation<T = unknown>(
  queryKey: QueryKey,
  options?: Omit<UseMutationOptions<T, TError, void, unknown>, "mutationFn">
) {
	  return reactive(useMutation<T, TError>(useStrapiMutationQuery, options));
}

localStorage.clear();

// Sentry

import * as Sentry from '@sentry/vue';
import { BrowserTracing } from "@sentry/tracing";




const app = createApp(App)

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    app,
    dsn: "https://e978fa7bb69c477b973332d21478092a@o1287888.ingest.sentry.io/6586531",
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(Router),
        tracingOrigins: ["localhost:3000", "bergflix.de", /^\//],
      }),
    ],
    beforeSend(event, hint) {
      // Check if it is an exception, and if so, show the report dialog
      if (event.exception) {
        Sentry.showReportDialog({ eventId: event.event_id });
      }
      return event;
    },
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}
app
  .use(Router)
  .use(Store)
  .use(VueQueryPlugin)
  .mount("#app");