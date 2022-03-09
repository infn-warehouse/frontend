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
              {{ $t("filters.users.id") }}
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
          :_fetch="tenantFetch"
          fetchSort="name"
          fetchName="name"
          fetchValue="id"
        >
        </FilterList>
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
import { DevourService } from "@/services/devour.service";

export default {
  components: {
    FilterList
  },

  computed: {
    ...mapGetters("filters", ["usersFilter", "usersFlag"])
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
        services: []
      },
      filterInfo: {
        agreementTypes: { multiple: true },
        services: { multiple: true }
      }
    };
  },

  methods: {
    ...mapMutations("filters", ["setUsersFilter", "setUsersFlag"]),

    save() {
      this.setUsersFilter(this.filterData);
    },
    load() {
      if (!this.usersFlag) return false;
      this.setUsersFlag(false);
      if (_.isEmpty(this.usersFilter)) return false;
      this.filterData=this.usersFilter;
      return true;
    },
    tenantFetch(paginationOpts=null,search) {
      return DevourService.fetchAll("services","tenant,links",paginationOpts,search,null);
    },
  },
};
</script>
