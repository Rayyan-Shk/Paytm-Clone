import { getServerSession } from 'next-auth'
import { SendCard } from '../../../components/SendCard'
import { authOptions } from '../../lib/auth'
import prisma from '@repo/db/client'
import { BalanceCard } from '../../../components/BalanceCard'
import { P2PTransactions } from '../../../components/P2PTransactions'


async function getBalance() {
 const session = await getServerSession(authOptions)
 const balance = await prisma.balance.findFirst({
   where: {
     userId: Number(session?.user?.id),
   },
 })
 return {
   amount: balance?.amount || 0,
   locked: balance?.locked || 0,
 }
}

async function getP2PTransactions() {
 const session = await getServerSession(authOptions)
 const txns = await prisma.p2pTransfer.findMany({
   where: {
     OR: [
       { fromUserId: Number(session?.user?.id) },
       { toUserId: Number(session?.user?.id) },
     ],
   },
 })

 return txns.map((t: { timestamp: any; amount: any; fromUserId: any }) => ({
   time: t.timestamp,
   amount: t.amount,
   transactionType: t.fromUserId == session?.user?.id ? 'Sent' : 'Received',
 }))
}

export default async function P2PTransferPage() {
 const balance = await getBalance()
 const transactions = await getP2PTransactions()

 return (
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 <h1 className="text-3xl font-bold text-[#6a51a6] mb-8">
   P2P Transfer
 </h1>
 <div className="flex flex-col lg:flex-row gap-8">
   <div className="flex-none lg:flex-1">
     <div className="sticky top-0">
       <SendCard />
     </div>
   </div>
   <div className="flex-1 space-y-8">
     <BalanceCard amount={balance.amount} locked={balance.locked} />
     <P2PTransactions transactions={transactions} />
   </div>
 </div>
</div>
 )
}
