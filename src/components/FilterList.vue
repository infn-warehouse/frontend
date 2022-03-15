<template>
  <div>
    <div v-if="type==1">
      <v-autocomplete
        autocomplete="off"
        :items="valueCopy"
        v-model="selectedItems"
        item-text="name"
        return-object
        multiple
        @change="setFilter1"
        :search-input.sync="search"
        no-filter
        clearable
      >
        <template v-slot:item="{ item }">
          <v-list-item-action>
            <v-icon v-if="item.checked">check_box</v-icon>
            <v-icon v-else>check_box_outline_blank</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-html="item.name"></v-list-item-title>
            <v-list-item-subtitle v-if="'subtitle' in item">
              {{ item.subtitle }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </v-autocomplete>
    </div>
    <div v-if="type==2 && showAll">
      <v-list-item v-for="(item, i) in valueCopy" :key="i" dense>
        <template>
          <v-list-item-action>
            <v-checkbox
              color="primary"
              v-model="item.checked"
              dense
              @change="setFilter2(item)"
            ></v-checkbox>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-subtitle>{{ item.name }}</v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </v-list-item>
      <v-col v-if="showButton">
        <v-btn
          color="primary"
          x-small
          @click="showAll = false"
          >{{ $t("filters.hide") }}</v-btn
        >
      </v-col>
    </div>
    <div v-if="type==2 && !showAll">
      <v-list-item v-for="(item, i) in valueCopy.slice(0, 5)" :key="i" dense>
        <template>
          <v-list-item-action>
            <v-checkbox
              color="primary"
              v-model="item.checked"
              @change="setFilter2(item)"
            ></v-checkbox>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </template>
      </v-list-item>
      <v-col v-if="!alwaysShowAllComputed">
        <v-btn
          color="primary"
          x-small
          @click="(showAll = true), (showButton = true)"
          >{{ $t("filters.showAll") }}</v-btn
        >
      </v-col>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import helper from "@/mixins/helper";

export default {
  data() {
    return {
      showAll: false,
      showButton: false,
      selectedItems: [],
      search: "",
      alwaysShowAllComputed: false,
      valueCopy: [],
      paginationOpts: {
        sortBy: [this.fetchSort],
        sortDesc: [false],
        page: 1,
        itemsPerPage: 10,
        multiSort: false,
        mustSort: true
      },      
    };
  },
  mixins: [helper],
  props: [
    "type",
    "value",
    "alwaysShowAll",
    "allowMultiple",
    "matchAttribute",
    "fetchSort",
    "fetch",
    "fetchName",
    "fetchValue",
  ],
  methods: {
    setFilter1(items) {
      this.valueCopy.forEach(element => {
        let found = false;
        items.every(item => {
          if (element[this.matchAttribute] == item[this.matchAttribute]) {
            found = true;
            return false;
          }
          return true;
        });
        element.checked=found;
      });
      this.$emit("input", this.valueCopy);
      this.$emit("change");
    },
    setFilter2() {
      this.$emit("input", this.valueCopy);
      this.$emit("change");
    },
    loadSelectedItems() {
      this.selectedItems = [];
      this.valueCopy.forEach(item => {
        if (item.checked) this.selectedItems.push(item);
      });
    },
    async _fetch() {
      let tempCopy=_.cloneDeep(this.value);
      if (this.fetch) {
        let res=this.operationWithCheck(await this.fetch(this.paginationOpts,this.search,null));
        if (res) {
          let items=res[0];
          let valueCopyNew=[];
          for (let val of items) {
            valueCopyNew.push({
              name: val[this.fetchName],
              value: val[this.fetchValue],
              sort: val[this.fetchSort],
              checked: false,
            });
          }
          for (let val of tempCopy) {
            if (val.checked) {
              let found=false;
              for (let val2 of valueCopyNew) {
                if (val2.value==val.value) {
                  found=true;
                  val2.checked=true;
                  break;
                }
              }
              if (!found) {
                valueCopyNew.push(val);
              }
            }
          }
          valueCopyNew=_.orderBy(valueCopyNew, 'sort', 'asc');
          this.valueCopy=valueCopyNew;
        }
      }
    },
    update() {
      switch (this.type) {
        case 1:
          this.loadSelectedItems();
          break;
        case 2:
          if (this.valueCopy.length <= 5) this.alwaysShowAllComputed = true;
          this.showAll = this.alwaysShowAllComputed;
          break;
      }
    },
  },
  async created() {
      await this._fetch();
      this.update();
  },
  watch: {
    search: _.debounce(async function(newVal,oldVal) {
      let oldCheck=oldVal==null || oldVal=="";
      let newCheck=newVal==null || newVal=="";
      if (oldCheck && newCheck) return;

      await this._fetch();
    }, process.env.VUE_APP_DEBOUNCE_TIME),
    value: function() {
      this.valueCopy=_.cloneDeep(this.value);
      this.update();
    }
  }
};
</script>

<style>
div.filter-list .v-list--dense .v-list-item,
.v-list-item--dense {
  height: 30px !important;
}

div.filter-list .v-list-item--dense .v-list-item__content {
  padding: 4px, 0px !important;
}
.v-autocomplete__content {
  max-width: 500px !important;
}
</style>
