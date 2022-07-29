import { Router } from "vue-router";
import { useStrapiSession } from "../../main";
import { MiddlewareContext } from "../router";

export default async function middleware({ to, next }: MiddlewareContext) {

    const identifier = String(to.params.identifier);
    console.log(identifier);
    useStrapiSession([identifier], {
        onSuccess: (data) => {
            console.log(data);
            return next()
        },
        onError: (error) => {
            return next({ name: 'home' })
        }
    });
    return next({ name: 'home' })
}