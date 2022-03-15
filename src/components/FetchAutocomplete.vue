<template>
  <v-autocomplete
    autocomplete="off"
    v-bind:value="value"
    v-on:input="onInput($event)"
    :items="items"
    :item-text="itemText"
    :item-value="itemValue"
    :return-object="returnObject"
    :label="label"
    :search-input.sync="search"
    :disabled="disabled"
    no-filter
    clearable
  >
    <!--<template v-slot:selection="{ item }">
      <slot name="selection" v-bind:item="item"></slot>
    </template>
    <template v-slot:item="{ item }">
      <slot name="item" v-bind:item="item"></slot>
    </template>-->
  </v-autocomplete>
</template>

<script>
import _ from "lodash";
import enums from "@/enums";
import helper from "@/mixins/helper";

export default {
  props: [
    "mode",
    "itemText",
    "itemValue",
    "returnObject",
    "label",
    "disabled",
    "value",
    "withModelId",
    "fetch"
  ],
  mixins: [helper],
  data() {
    return {
      paginationOpts: {
        sortBy: [this.itemText],
        sortDesc: [false],
        page: 1,
        itemsPerPage: 10,
        multiSort: false,
        mustSort: true
      },
      search: "",
      searchComputed: "",
      filter: {},
      items: [],
      total: null
    };
  },
  computed: {
    enums() {
      return enums;
    }
  },
  watch: {
    search: _.debounce(async function querySearch(newVal,oldVal) {
      let oldCheck=oldVal==null || oldVal=="";
      let newCheck=newVal==null || newVal=="";
      if (oldCheck && newCheck) return;

      this.searchComputed=this.search;
      this.filter=null;
      await this._fetch();
    }, process.env.VUE_APP_DEBOUNCE_TIME),
  },
  methods: {
    async _fetch() {
      let res=this.operationWithCheck(await this.fetch(this.paginationOpts,this.searchComputed,this.filter));
      if (res) {
        [this.items,this.total]=res;
      }
    },
    onInput(val) {
      this.$emit("input", val);
    }
  },
  async created() {
    if (this.withModelId)
      this.filter[this.itemValue]={value: this.withModelId};
    else if (this.value) {
      if (!this.returnObject)
        this.filter[this.itemValue]={value: this.value};
      else if (this.itemValue in this.value)
        this.filter[this.itemValue]={value: this.value[this.itemValue]};
    }

    await this._fetch();

    if (this.withModelId && this.mode==enums.FORM_MODE.CREATE)
      this.$emit("input", this.items[0]);
  }
};
</script>
