import {Amplify} from 'aws-amplify';
import {createApp} from 'vue';

import './assets/main.scss'
import 'vue3-toastify/dist/index.css';
import App from './App.vue';
import config from './config/aws-exports.js';
import {setupIcons} from "@/config/icons";
import {setupApollo} from './config/vue-apollo';

Amplify.configure(config);

const app = createApp(App);
setupIcons(app)
setupApollo(app);

app.mount('#app');
