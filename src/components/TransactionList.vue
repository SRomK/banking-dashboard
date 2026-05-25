<script setup lang="ts">
// ─── ref vs reactive: la pregunta más común en entrevistas Vue 3
//
// ref()      → para valores primitivos (string, number, boolean).
//              Accedes al valor con .value en JS, pero NO en el template.
//
// reactive() → para objetos. No necesitas .value.
//              Cuidado: si desestructuras, pierdes reactividad.
//
// Regla práctica: usa ref() por defecto. reactive() cuando tienes un objeto
// con muchos campos relacionados que siempre se usan juntos.

import { ref, reactive, computed, watch } from 'vue'
import type { Transaction } from '@/types'

const props = defineProps<{
  transactions: Transaction[]
}>()

// ref() para un valor simple: el texto del filtro
const searchQuery = ref('')

// reactive() para un objeto de filtros relacionados — tienen sentido juntos
const filters = reactive({
  type: '' as '' | 'credit' | 'debit',
  category: '' as '' | Transaction['category'],
})

// computed que combina los filtros — se recalcula solo cuando cambia
// searchQuery.value, filters.type o filters.category
const filteredTransactions = computed(() => {
  return props.transactions.filter((t) => {
    const matchesSearch = t.description
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
    const matchesType = !filters.type || t.type === filters.type
    const matchesCategory = !filters.category || t.category === filters.category
    return matchesSearch && matchesType && matchesCategory
  })
})

// watch() observa cambios reactivos y ejecuta un efecto secundario.
// Equivale al `watch: {}` de Vue 2, pero más explícito.
//
// watch(source, callback, options)
// - immediate: true → ejecuta el callback también en el primer render
// - deep: true       → observa cambios anidados en objetos
watch(searchQuery, (newVal, oldVal) => {
  console.log(`Search changed: "${oldVal}" → "${newVal}"`)
})

// Para observar un objeto reactivo completo usas una función getter
// o pasas el objeto directamente con { deep: true }
watch(
  () => ({ ...filters }),
  (newFilters) => {
    console.log('Filters updated:', newFilters)
  },
)

function clearFilters() {
  searchQuery.value = ''
  filters.type = ''
  filters.category = ''
}

function formatAmount(transaction: Transaction): string {
  const sign = transaction.type === 'credit' ? '+' : '-'
  return `${sign}${new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(Math.abs(transaction.amount))}`
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(dateStr))
}
</script>

<template>
  <div class="transaction-list">
    <div class="transaction-list__filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search transactions..."
        class="filter-input"
      />
      <select v-model="filters.type" class="filter-select">
        <option value="">All types</option>
        <option value="credit">Income</option>
        <option value="debit">Expense</option>
      </select>
      <select v-model="filters.category" class="filter-select">
        <option value="">All categories</option>
        <option value="transfer">Transfer</option>
        <option value="payment">Payment</option>
        <option value="income">Income</option>
        <option value="subscription">Subscription</option>
      </select>
      <button v-if="searchQuery || filters.type || filters.category" @click="clearFilters" class="clear-btn">
        Clear
      </button>
    </div>

    <p class="transaction-list__count">
      {{ filteredTransactions.length }} transactions
    </p>

    <ul class="transaction-list__items">
      <li
        v-for="transaction in filteredTransactions"
        :key="transaction.id"
        class="transaction-item"
      >
        <div class="transaction-item__info">
          <span class="transaction-item__desc">{{ transaction.description }}</span>
          <span class="transaction-item__date">{{ formatDate(transaction.date) }}</span>
        </div>
        <span
          class="transaction-item__amount"
          :class="transaction.type === 'credit' ? 'amount--credit' : 'amount--debit'"
        >
          {{ formatAmount(transaction) }}
        </span>
      </li>
    </ul>

    <p v-if="filteredTransactions.length === 0" class="transaction-list__empty">
      No transactions match your filters.
    </p>
  </div>
</template>

<style scoped>
.transaction-list__filters {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.filter-input,
.filter-select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 0.875rem;
  background: #fff;
}
.filter-input { flex: 1; min-width: 180px; }
.clear-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: #f1f5f9;
  cursor: pointer;
  font-size: 0.875rem;
}
.clear-btn:hover { background: #e2e8f0; }
.transaction-list__count {
  font-size: 0.8rem;
  color: #94a3b8;
  margin: 0 0 8px;
}
.transaction-list__items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 10px;
  background: #f8fafc;
  transition: background 0.15s;
}
.transaction-item:hover { background: #f1f5f9; }
.transaction-item__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.transaction-item__desc { font-size: 0.9rem; font-weight: 500; }
.transaction-item__date { font-size: 0.75rem; color: #94a3b8; }
.transaction-item__amount { font-weight: 600; font-size: 0.9rem; }
.amount--credit { color: #16a34a; }
.amount--debit { color: #dc2626; }
.transaction-list__empty { color: #94a3b8; text-align: center; padding: 32px; }
</style>
