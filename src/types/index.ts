export interface Account {
  id: string
  owner: string
  iban: string
  balance: number
  currency: string
}

export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: 'credit' | 'debit'
  category: 'transfer' | 'payment' | 'income' | 'subscription'
}
