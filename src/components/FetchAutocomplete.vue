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
    :disabled="disabled || model!=null"
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
    "model",
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
    search: function (newVal,oldVal) {
      if (this.model) return;

      let oldCheck=oldVal==null || oldVal=="";
      let newCheck=newVal==null || newVal=="";
      if (oldCheck && newCheck) return;

      this.updateSearch();
    },
  },
  methods: {
    updateSearch: _.debounce(async function () {
      this.searchComputed=this.search;
      this.filter=null;
      await this._fetch();
    }, process.env.VUE_APP_DEBOUNCE_TIME),
    async _fetch() {
      let res=await this.operationWithCheck(async () => await this.fetch(this.paginationOpts,this.searchComputed,this.filter));
      if (res) {
        [this.items,this.total]=res;
      }
    },
    onInput(val) {
      this.$emit("input", val);
    }
  },
  async created() {
    if (this.model)
      this.filter[this.itemValue]={value: this.model};
    else if (this.value) {
      if (!this.returnObject)
        this.filter[this.itemValue]={value: this.value};
      else if (this.itemValue in this.value)
        this.filter[this.itemValue]={value: this.value[this.itemValue]};
    }

    await this._fetch();

    if (this.model && this.mode==enums.FORM_MODE.CREATE) {
      if (this.returnObject)
        this.$emit("input", this.items[0]);
      else
        this.$emit("input", this.items[0][this.itemValue]);
    }
  }
};
</script>
