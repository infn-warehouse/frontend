<template>
  <v-container fluid class="my-toolbar">
    <v-row align="center">
      <v-col :cols="mobile2(withSearch?4:8)" align="left">
        <v-btn class="mr-4 align-middle" v-if="withBack" fab small @click="goTo()">
          <v-icon>{{ enums.ICONS.BACK }}</v-icon>
        </v-btn>
        <span class="align-middle text-h5" v-if="title">{{ title }}</span>
      </v-col>
      <v-col :cols="mobile2(4)" v-if="withSearch">
        <v-text-field
          :label="$t('misc.search')"
          v-model="searchText"
          @input="onSearch"
          clearable
          single-line
        ></v-text-field>
      </v-col>
      <v-col :cols="mobile2(4)" align="right" v-if="withFilter || withAdd || withEdit || withDelete">
        <template v-for="(b,i) in buttons">
          <v-tooltip :key="i" top>
            <template v-slot:activator="{ on }">
              <v-btn
                class="ml-2"
                icon
                large
                @click="b.callback()"
                v-on="on"
              >
                <v-icon :color="b.color">{{ b.icon }}</v-icon>
              </v-btn>
            </template>
            <span>{{ b.text }}</span>
          </v-tooltip>
        </template>
        <v-btn
          v-if="withFilter"
          @click="onFilter"
          small
          outlined
          color="secondary"
          :class="{ 'colored-button': !allClear, 'ml-2': true }"
        >
          {{ $t("buttons.filter") }}
        </v-btn>
        <v-btn
          v-if="withAdd"
          @click="onAdd"
          small
          color="accent"
          class="ml-2"
        >
          <v-icon>{{ enums.ICONS.ADD }}</v-icon>
          <span>{{ $t("buttons.create") }}</span>
        </v-btn>
        <v-btn
          v-if="withEdit"
          class="ml-2"
          icon
          large
          @click="onEdit"
        >
          <v-icon>{{ enums.ICONS.EDIT }}</v-icon>
        </v-btn>
        <v-btn
          v-if="withDelete"
          class="ml-2"
          icon
          large
          @click="onDelete"
        >
          <v-icon>{{ enums.ICONS.DELETE }}</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import enums from "@/enums";
import _ from "lodash";
import helper from "@/mixins/helper";

export default {
  props: {
    title: String,
    withSearch: Boolean,
    withAdd: Boolean,
    withFilter: Boolean,
    withBack: Boolean,
    withEdit: Boolean,
    withDelete: Boolean,
    allClear: {
      type: Boolean,
      default: true
    },
    buttons: Array
  },
  mixins: [helper],
  data() {
    return {
      searchText: "",
    };
  },
  computed: {
    enums() {
      return enums;
    },
  },
  methods: {
    goTo() {
      this.$emit("onBack");
      this.$router.go(-1);
    },    
    onAdd() {
      this.$emit("onAdd");
    },
    onFilter() {
      this.$emit("onFilter");
    },
    onEdit() {
      this.$emit("onEdit");
    },
    onDelete() {
      this.$emit("onDelete");
    },
    onSearch: _.debounce(function() {
      this.$emit("onSearch", this.searchText);
    }, process.env.VUE_APP_DEBOUNCE_TIME)
  },
};
</script>

<style scoped>
.colored-button {
  background-color: var(--v-secondary-lighten5);
}
.my-toolbar {
  min-height: 96px;
}
.my-toolbar .row {
  min-height: 96px;
}
</style>
