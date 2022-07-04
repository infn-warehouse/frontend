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
          v-model="filterData.columns0"
          @change="handleChange"
          @save="handleSave(0)"
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

export default {
  components: {
    FilterList
  },

  computed: {
    ...mapGetters("filters", ["operationsFilter", "operationsFlag"]),
      filter: function() { return this.operationsFilter },
      flag: function() { return this.operationsFlag },
  },

  mixins: [helper,filterShared],

  data() {
    return {
      headersCount: 1,
      filterData: {
        
      },
      filterInfo: {
        
      },
      setFilter: this.setOperationsFilter,
      setFlag: this.setOperationsFlag,
    };
  },

  methods: {
    ...mapMutations("filters", ["setOperationsFilter", "setOperationsFlag"]),
  },
};
</script>
