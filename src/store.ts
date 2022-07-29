import { createStore } from "vuex";
import { Session } from "./models/custom";

interface FormData {
    [key: string]: any;
}

export default createStore<{ session: Session, formData: FormData }>({
    state: {
        session: {},
        formData: {}
    },
    mutations: {
        setFormData (state, data: FormData) {
            state.formData = { ...state.formData, ...data };
        },
        setIdentifier (state, session: Session) {
            state.session = session;
        }
    }
})