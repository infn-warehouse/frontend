<template>
  <v-navigation-drawer
    class="filter-drawer"
    v-model="drawer"
    v-show="drawer"
    absolute
    temporary
  >
    <v-toolbar color="primary" dark>
      <v-toolbar-title>{{ $t("misc.filters") }}</v-toolbar-title>
    </v-toolbar>
    <v-list dense>
      <v-list-group>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t("misc.columns") }}
            </v-list-item-title>
          </v-list-item-content>
        </template>
        <FilterList
          :type="2"
          :save="true"
          matchAttribute="value"
          v-model="filterData.columns"
          @change="handleChange"
          @save="handleSave"
        >
        </FilterList>
      </v-list-group>
    </v-list>
    <v-divider></v-divider>
    <v-list dense>
      <v-list-group>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t("headers.items.ubicazione") }}
            </v-list-item-title>
          </v-list-item-content>
        </template>
        <FilterList
          :type="1"
          matchAttribute="value"
          v-model="filterData.ubicazione"
          @change="handleChange"
          :fetch="locationFetch"
          fetchSort="descrizione"
          fetchName="descrizione"
          fetchValue="idUbicazione"
        >
        </FilterList>
      </v-list-group>
    </v-list>
    <v-divider></v-divider>
    <div class="my-container align-right">
      <v-btn color="primary" @click="clearFilters">
        {{ $t("buttons.clear") }}
      </v-btn>
      <v-btn color="primary" @click="close" class="ml-2">
        {{ $t("buttons.close") }}
      </v-btn>
    </div>
  </v-navigation-drawer>
</template>

<script>
import _ from "lodash";
import FilterList from "@/components/FilterList";
import helper from "@/mixins/helper";
import filterShared from "@/mixins/filterShared";
import { mapGetters, mapMutations } from "vuex";
import GraphileService from "@/services/graphile.service";

export default {
  components: {
    FilterList
  },

  computed: {
    ...mapGetters("filters", ["itemsFilter", "itemsFlag"]),
      filter: function() { return this.itemsFilter },
      flag: function() { return this.itemsFlag },
  },

  mixins: [helper,filterShared],

  data() {
    return {
      filterData: {
        ubicazione: []
      },
      filterInfo: {
        ubicazione: { },
      },
      setFilter: this.setItemsFilter,
      setFlag: this.setItemsFlag,
    };
  },

  methods: {
    ...mapMutations("filters", ["setItemsFilter", "setItemsFlag"]),

    locationFetch(paginationOpts=null,search) {
      return GraphileService.fetchAll("Ubicazioni",[],[],null,{search, on: ["descrizione"]},paginationOpts);
    },
  },
};
</script>
