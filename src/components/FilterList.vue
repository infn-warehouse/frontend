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
      <template v-for="(item, i) in valueCopy">
        <v-list-item v-if="!item.hidden" :key="i" dense>
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
        </v-list-item>
      </template>
      <v-col v-if="showButton || !clear">
        <v-btn
          color="primary"
          x-small
          @click="showAll = false"
           v-if="showButton"
          >{{ $t("buttons.hideAll") }}</v-btn
        >
        <v-btn
          class="ml-2"
          color="primary"
          x-small
          @click="savePref()"
          v-if="!clear"
          >{{ $t("buttons.savePref") }}</v-btn
        >
      </v-col>
    </div>
    <div v-if="type==2 && !showAll">
      <template v-for="(item, i) in valueCopy.slice(0, 5)">
        <v-list-item v-if="!item.hidden" :key="i" dense>
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
        </v-list-item>
      </template>
      <v-col v-if="!alwaysShowAllComputed">
        <v-btn
          color="primary"
          x-small
          @click="(showAll = true), (showButton = true)"
          >{{ $t("buttons.showAll") }}</v-btn
        >
        <v-btn
          class="ml-2"
          color="primary"
          x-small
          @click="savePref()"
          v-if="!clear"
          >{{ $t("buttons.savePref") }}</v-btn
        >
      </v-col>
    </div>
    <div v-if="type==3">
      <template v-for="(item, i) in valueCopy">
        <v-list-item v-if="!item.hidden" :key="i" dense>
          <v-list-item-action>
            <v-checkbox
              color="primary"
              v-model="item.checked"
              @change="setFilter3(item)"
              off-icon="$radioOff"
              on-icon="$radioOn"
              :readonly="item.checked"
            ></v-checkbox>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
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
      },   
      clear: false,
      radioIndex: 0
    };
  },
  mixins: [helper],
  props: [
    "type",
    "value",
    "alwaysShowAll",
    "matchAttribute",
    "fetchSort",
    "fetch",
    "fetchName",
    "fetchValue",
    "save",
    "filterInfo",
  ],
  methods: {
    updateSearch: _.debounce(async function () {
      await this._fetch();
    }, process.env.VUE_APP_DEBOUNCE_TIME),
    savePref() {
      this.valueCopy.forEach(element => {
        element.default=element.checked;
      });
      this.computeClear();
      this.$emit("save");
      this.$emit("change");
    },
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
    computeClear() {
      for (let o of this.valueCopy) {
        if (o.checked!=o.default) {
          this.clear=false;
          return;
        }
      }
      this.clear=true;
    },
    setFilter2(item) {
      this.computeClear();
      this.$emit("input", this.valueCopy);
      this.$emit("change");
    },
    setFilter3(item) {
      this.valueCopy.forEach((i) => {
        if (i!=item) i.checked=false;
      });
      this.setFilter2(item);
    },
    loadSelectedItems() {
      this.selectedItems = [];
      this.valueCopy.forEach(item => {
        if (item.checked) this.selectedItems.push(item);
      });
    },
    async _fetch() {
      let res=await this.operationWithCheck(async () => await this.fetch(this.paginationOpts,this.search,null));
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
        for (let val of this.value) {
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
      if (this.fetch)
        await this._fetch();
      else
        this.valueCopy=_.cloneDeep(this.value);
      this.computeClear();
      this.update();
  },
  watch: {
    search: function(newVal,oldVal) {
      let oldCheck=oldVal==null || oldVal=="";
      let newCheck=newVal==null || newVal=="";
      if (oldCheck && newCheck) return;

      this.updateSearch();
    },
    value: function() {
      this.valueCopy=_.cloneDeep(this.value);
      this.computeClear();
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
