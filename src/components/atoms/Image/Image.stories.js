import Component from './Image.vue';

export default {
  title: '⚛️ Atoms / Image',
  component: Component
};

const Template = (args) => ({
  components: { Component },
  setup() {
    return { args }
  },
  template: `<Component v-bind="args" />`
});

export const Image = Template.bind({});
Image.args = { };
