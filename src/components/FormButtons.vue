<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <v-btn
          v-if="withDelete"
          color="warning"
          text
          @click="onDelete()"
          :disabled="loading"
        >
          <v-icon>delete</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="9" class="text-right">
        <v-progress-circular indeterminate class="ml-3" v-if="loading" />
        <v-btn
          v-if="multiForm && multiLayout > 0"
          class="ml-3"
          @click="onBack()"
          color="primary"
          :disabled="loading"
          >{{ $t("buttons.back") }}</v-btn
        >
        <v-btn
          v-if="multiForm && multiLayout != 2"
          class="ml-3"
          @click="onNext()"
          color="primary"
          :disabled="disabled || loading"
          >{{ $t("buttons.next") }}</v-btn
        >
        <v-btn
          v-if="!multiForm || multiLayout == 2"
          class="ml-3"
          color="primary"
          @click="onSave()"
          :disabled="disabled || loading"
          >{{ $t("buttons.save") }}</v-btn
        >
        <v-btn v-if="!noCancel" class="ml-3" :disabled="loading" text @click="onCancel()">{{
          $t("buttons.cancel")
        }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: [
    "withDelete",
    "disabled",
    "multiForm",
    "multiLayout",
    "loading",
    "noCancel"
  ],
  methods: {
    onDelete() {
      this.$emit("onDelete");
    },
    onBack() {
      this.$emit("onBack");
    },
    onNext() {
      this.$emit("onNext");
    },
    onSave() {
      this.$emit("onSave");
    },
    onCancel() {
      this.$emit("onCancel");
    }
  }
};
</script>
