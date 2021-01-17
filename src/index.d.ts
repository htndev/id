declare global {
  import Vue, { VNode } from 'vue';

  namespace JSX {
    type Element = VNode;
    type ElementClass = Vue;
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}

declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module '*.gql' {
  import { DocumentNode } from 'graphql';

  const content: DocumentNode;
  export default content;
}

declare module '*.graphql' {
  import { DocumentNode } from 'graphql';

  const content: DocumentNode;
  export default content;
}
