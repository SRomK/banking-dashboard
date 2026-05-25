<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AccountCard from '@/components/AccountCard.vue'
import TransactionList from '@/components/TransactionList.vue'
import type { Account, Transaction } from '@/types'

const account = ref<Account | null>(null)
const transactions = ref<Transaction[]>([])
const isLoading = ref(true)

onMounted(async () => {
  await loadDashboardData()
})

async function loadDashboardData() {
  isLoading.value = true
  await new Promise((resolve) => setTimeout(resolve, 1000))

  account.value = {
    id: 'acc-001',
    owner: 'Sofia Romero Kamermann',
    iban: 'DE89 3704 0044 0532 0130 00',
    balance: 3842.5,
    currency: 'EUR',
  }

  transactions.value = [
    { id: 't1', date: '2026-05-24', description: 'Netflix Subscription', amount: 17.99, type: 'debit', category: 'subscription' },
    { id: 't2', date: '2026-05-23', description: 'Salary - BBVA Technology', amount: 3200.0, type: 'credit', category: 'income' },
    { id: 't3', date: '2026-05-22', description: 'Mercadona', amount: 84.3, type: 'debit', category: 'payment' },
    { id: 't4', date: '2026-05-21', description: 'Transfer to savings', amount: 500.0, type: 'debit', category: 'transfer' },
    { id: 't5', date: '2026-05-20', description: 'Spotify Premium', amount: 9.99, type: 'debit', category: 'subscription' },
    { id: 't6', date: '2026-05-19', description: 'Freelance project', amount: 750.0, type: 'credit', category: 'income' },
    { id: 't7', date: '2026-05-18', description: 'Renfe ticket', amount: 42.5, type: 'debit', category: 'payment' },
    { id: 't8', date: '2026-05-17', description: 'Reimbursement from Sara', amount: 25.0, type: 'credit', category: 'transfer' },
  ]

  isLoading.value = false
}
</script>

<template>
  <main class="dashboard">
    <header class="dashboard__header">
      <h1 class="dashboard__title">My Account</h1>
    </header>

    <section class="dashboard__account">
      <AccountCard
        v-if="account || isLoading"
        :account="account ?? { id: '', owner: '', iban: '', balance: 0, currency: 'EUR' }"
        :is-loading="isLoading"
      />
    </section>

    <section class="dashboard__transactions">
      <h2 class="dashboard__section-title">Recent Transactions</h2>
      <div v-if="isLoading" class="dashboard__loading">Loading transactions...</div>
      <TransactionList v-else :transactions="transactions" />
    </section>
  </main>
</template>

<style scoped>
.dashboard {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 16px;
  font-family: system-ui, sans-serif;
}
.dashboard__header {
  margin-bottom: 24px;
}
.dashboard__title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}
.dashboard__account {
  margin-bottom: 32px;
}
.dashboard__section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #475569;
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.dashboard__loading {
  color: #94a3b8;
  padding: 24px 0;
}
</style>
