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
              {{ $t("custom.columnsMovement") }}
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
    <v-list dense>
      <v-list-group>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t("custom.columnsOrder") }}
            </v-list-item-title>
          </v-list-item-content>
        </template>
        <FilterList
          :type="2"
          :save="true"
          matchAttribute="value"
          v-model="filterData.columns1"
          @change="handleChange"
          @save="handleSave(1)"
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
              {{ $t("headers.movements.dataMovimento") }}
            </v-list-item-title>
          </v-list-item-content>
        </template>
          <DatePicker
            :label="$t('misc.from')"
            v-model="filterData.dataMovimento.from"
            @change="handleChange"
          ></DatePicker>
          <DatePicker
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
    <v-divider></v-divider>
    <v-list dense>
      <v-list-group>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t("headers.movements.inUscita") }}
            </v-list-item-title>
          </v-list-item-content>
        </template>
        <FilterList
          :type="3"
          matchAttribute="value"
          v-model="filterData.inUscita"
          :filterInfo="filterInfo.inUscita"
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
              {{ $t("headers.movements.dataordine") }}
            </v-list-item-title>
          </v-list-item-content>
        </template>
          <DatePicker
            :label="$t('misc.from')"
            v-model="filterData.dataordine.from"
            @change="handleChange"
          ></DatePicker>
          <DatePicker
            :label="$t('misc.to')"
            v-model="filterData.dataordine.to"
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
              {{ $t("headers.movements.statOrdine") }}
            </v-list-item-title>
          </v-list-item-content>
        </template>
        <FilterList
          :type="3"
          matchAttribute="value"
          v-model="filterData.statOrdine"
          :filterInfo="filterInfo.statOrdine"
          @change="handleChange"
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
      headersCount: 2,
      filterData: {
        tipoDocAcc: [],
        dataMovimento: {},
        inUscita: [
          { name: this.$t("misc.all"), all: true, checked: true, default: true },
          { name: this.$t("items.inbound"), value: false, checked: false },
          { name: this.$t("items.outbound"), value: true, checked: false }
        ],
        dataordine: {},
        statOrdine: [
          { name: this.$t("misc.all"), all: true, checked: true, default: true },
          { name: this.$t("items.conto"), value: "C", checked: false },
          { name: this.$t("items.saldo"), value: "S", checked: false }
        ]
      },
      filterInfo: {
        tipoDocAcc: { },
        dataMovimento: { type: "range" },
        inUscita: { },
        dataordine: { type: "range" },
        statOrdine: { }
      },
      setFilter: this.setMovementsFilter,
      setFlag: this.setMovementsFlag,
    };
  },

  methods: {
    ...mapMutations("filters", ["setMovementsFilter", "setMovementsFlag"]),

    documentFetch(paginationOpts=null,search,filter) {
      return GraphileService.fetchAll("Documento",[],[],filter,{search, on: ["dicitura"]},paginationOpts);
    },
  },
};
</script>
