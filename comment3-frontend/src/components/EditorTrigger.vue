<template>
  <section
      :class="['editor-trigger-section']"
  >
    <div
        class="avatar-box"
    >
      <UserAvatar
          :scale="avatarScale"
          :nfc="$store.state.User.is_nfc"
          :profileId="$store.state.User.id"
      />
    </div>
    <div
        class="topic-editor"
    >
      <div
          class="editor-trigger"
          v-on:click="onClick"
      >
        <span>{{placeholder}}</span>
      </div>
    </div>
  </section>
</template>

<script lang="ts">

import { defineComponent } from "vue";
import UserAvatar from "@/components/UserAvatar.vue";

export default defineComponent({
  components: {UserAvatar},
  props: {
    triggerFunc: Function,
    placeholder: {type:String,default:''},
    avatarScale: {type:Number,default:2},
  },
  data() {
    return {
    }
  },
  methods:{
    onClick(): void {
      // if current user is a guest or inactive user, show login/confirm popup
      if (this.$store.state.User.id && this.$store.state.User.activate) {

        if (typeof this.triggerFunc === 'function') {
          this.triggerFunc();
        }

        return;
      }

      this.$store.commit('setShowLoginModal', 1);
    }
  }
});
</script>

<style lang="scss" scoped>
section {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;

  .avatar-box {
    order: 1;
    flex-shrink: 0;
    padding-right: var(--p2);

    &.mobile {
      padding-right: var(--p4);
    }
  }

  .topic-editor {
    order: 1;
    flex: 1 1 auto;


    .editor-trigger {
      line-height: 34px;
      text-indent: var(--p3);
      color: var(--desc-color);
      @include input;
      border: $border-width $border-style var(--border-color2);
    }
  }
}
</style>