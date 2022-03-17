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
              {{ $t("headers.movements.dataMovimento") }}
            </v-list-item-title>
          </v-list-item-content>
        </template>
          <DatePicker
            class="required"
            :label="$t('misc.from')"
            v-model="filterData.dataMovimento.from"
            @change="handleChange"
          ></DatePicker>
          <DatePicker
            class="required"
            :label="$t('misc.to')"
            v-model="filterData.dataMovimento.to"
            @change="handleChange"
          ></DatePicker>
      </v-list-group>
    </v-list>
    <v-divider></v-divider>
    <v-list dense>
      <v-list-group>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t("headers.movements.tipoDocAcc") }}
            </v-list-item-title>
          </v-list-item-content>
        </template>
        <FilterList
          :type="1"
          matchAttribute="value"
          v-model="filterData.tipoDocAcc"
          @change="handleChange"
          :fetch="documentFetch"
          fetchSort="dicitura"
          fetchName="dicitura"
          fetchValue="idocumento"
        >
        </FilterList>
      </v-list-group>
    </v-list>
    <!-- <v-toolbar color="primary" dark>
      <v-toolbar-title>{{ $t("misc.filters") }}</v-toolbar-title>
    </v-toolbar>
    <v-list dense>
      <v-list-group>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t("filters.movements.tipoDocAcc") }}
            </v-list-item-title>
          </v-list-item-content>
        </template>
        <FilterList
          :type="1"
          matchAttribute="value"
          v-model="filterData.agreementTypes"
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
              {{ $t("filters.users.name") }}
            </v-list-item-title>
          </v-list-item-content>
        </template>
        <FilterList
          :type="2"
          :allowMultiple="false"
          :alwaysShowAll="false"
          v-model="filterData.agreementTypes"
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
              {{ $t("filters.users.services") }}
            </v-list-item-title>
          </v-list-item-content>
        </template>
        <FilterList
          :type="1"
          matchAttribute="value"
          v-model="filterData.services"
          @change="handleChange"
          :fetch="documentFetch"
          fetchSort="name"
          fetchName="name"
          fetchValue="id"
        >
        </FilterList>
      </v-list-group>
    </v-list> -->
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
import GraphileService from "@/services/graphile.service";
import DatePicker from "@/components/DatePicker";

export default {
  components: {
    FilterList,
    DatePicker
  },

  computed: {
    ...mapGetters("filters", ["movementsFilter", "movementsFlag"]),
      filter: function() { return this.movementsFilter },
      flag: function() { return this.movementsFlag },
  },

  mixins: [helper,filterShared],

  data() {
    return {
      filterData: {
        agreementTypes: [
          { name: "Tutti", checked: false, all: true },
          { name: "SI", value: "SI", checked: false },
          { name: "NO", value: "NO", checked: false }
        ],
        tipoDocAcc: [],
        dataMovimento: {}
      },
      filterInfo: {
        agreementTypes: { multiple: true },
        tipoDocAcc: { multiple: true },
        dataMovimento: { type: "range" }
      },
      setFilter: this.setMovementsFilter,
      setFlag: this.setMovementsFlag,
    };
  },

  methods: {
    ...mapMutations("filters", ["setMovementsFilter", "setMovementsFlag"]),

    documentFetch(paginationOpts=null,search) {
      return GraphileService.fetchAll("Documento",[],[],null,{search, on: ["dicitura"]},paginationOpts);
    },
  },
};
</script>
