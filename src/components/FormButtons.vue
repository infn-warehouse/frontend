<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <div class="saved" v-if="saved">
          <v-icon>{{enums.ICONS.CHECK}}</v-icon> <span>{{ $t("misc.saved") }}</span>
        </div>
        <!-- <v-btn
          v-if="withDelete"
          color="warning"
          text
          @click="onDelete()"
          :disabled="disabledAll || loading"
        >
          <v-icon>delete</v-icon>
        </v-btn> -->
      </v-col>
      <v-col cols="9" class="text-right">
        <v-progress-circular indeterminate class="ml-3" v-if="loading" />
        <v-btn
          v-if="multiForm && multiLayout > 0"
          class="ml-3"
          @click="onBack()"
          color="primary"
          :disabled="disabledAll || loading"
          >{{ $t("buttons.back") }}</v-btn
        >
        <v-btn
          v-if="multiForm && multiLayout != 2"
          class="ml-3"
          @click="onNext()"
          color="primary"
          :disabled="disabledAll || disabled || loading"
          >{{ $t("buttons.next") }}</v-btn
        >
        <v-btn
          v-if="!multiForm || multiLayout == 2"
          class="ml-3"
          color="primary"
          @click="onSave()"
          :disabled="disabledAll || disabled || loading"
          >{{ $t("buttons.save") }}</v-btn
        >
        <v-btn
          v-if="!noCancel"
          class="ml-3"
          text
          @click="onCancel()"
          :disabled="disabledAll || loading"
          >{{ $t("buttons.cancel") }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import enums from "@/enums";

export default {
  computed: {
    enums() {
      return enums;
    }
  },
  
  props: [
    // "withDelete",
    "disabled",
    "disabledAll",
    "multiForm",
    "multiLayout",
    "loading",
    "noCancel",
    "saved"
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

<style scoped>
.saved {
  line-height: 36px;
}
.saved .v-icon {
  vertical-align: middle;
}
.saved span {
  vertical-align: middle;
}
</style>