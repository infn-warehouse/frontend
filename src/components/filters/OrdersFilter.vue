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
              {{ $t("misc.fields") }}
            </v-list-item-title>
          </v-list-item-content>
        </template>
        <FilterList
          :type="2"
          matchAttribute="value"
          v-model="filterData.fields"
          @change="handleChange"
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
              {{ $t("headers.orders.dataordine") }}
            </v-list-item-title>
          </v-list-item-content>
        </template>
          <DatePicker
            class="required"
            :label="$t('misc.from')"
            v-model="filterData.dataordine.from"
            @change="handleChange"
          ></DatePicker>
          <DatePicker
            class="required"
            :label="$t('misc.to')"
            v-model="filterData.dataordine.to"
            @change="handleChange"
          ></DatePicker>
      </v-list-group>
    </v-list>
    <v-divider></v-divider>
    <div class="my-container align-right">
      <v-btn color="primary" @click="clearFilters">
        {{ $t("buttons.clear") }}
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
import DatePicker from "@/components/DatePicker";

export default {
  components: {
    DatePicker,
    FilterList
  },

  computed: {
    ...mapGetters("filters", ["ordersFilter", "ordersFlag"]),
      filter: function() { return this.ordersFilter },
      flag: function() { return this.ordersFlag },
  },

  mixins: [helper,filterShared],

  data() {
    return {
      filterData: {
        dataordine: {}
      },
      filterInfo: {
        dataordine: { type: "range" }
      },
      setFilter: this.setOrdersFilter,
      setFlag: this.setOrdersFlag,
    };
  },

  methods: {
    ...mapMutations("filters", ["setOrdersFilter", "setOrdersFlag"]),
  },
};
</script>
