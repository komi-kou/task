import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 テストデータの投入開始...')

  // テストユーザーを取得または作成
  let user = await prisma.user.findUnique({
    where: { email: 'test@example.com' }
  })

  if (!user) {
    const hashedPassword = await bcrypt.hash('password123', 10)
    user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'テストユーザー',
        role: 'user'
      }
    })
    console.log('✅ テストユーザー作成完了')
  } else {
    console.log('✅ 既存のテストユーザーを使用')
  }

  // 1. 顧客データ作成
  console.log('\n📝 顧客データ作成中...')
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'テスト太郎',
        email: 'taro@example.com',
        phone: '090-1234-5678',
        company: 'テスト株式会社',
        status: 'active',
        contractDate: new Date(),
        contractAmount: 1000000,
        industry: 'IT',
        userId: user.id
      }
    }),
    prisma.customer.create({
      data: {
        name: 'サンプル花子',
        email: 'hanako@example.com',
        phone: '080-9876-5432',
        company: 'サンプル有限会社',
        status: 'active',
        contractDate: new Date(),
        contractAmount: 2000000,
        industry: '製造業',
        userId: user.id
      }
    })
  ])
  console.log(`✅ ${customers.length}件の顧客データ作成完了`)

  // 2. タスクデータ作成
  console.log('\n📝 タスクデータ作成中...')
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'システム設計書作成',
        description: '新機能のシステム設計書を作成する',
        status: 'not_started',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        estimatedHours: 16,
        assignee: 'テスト太郎',
        category: 'documentation',
        tags: '設計,重要',
        progress: 0,
        userId: user.id,
        customerId: customers[0].id
      }
    }),
    prisma.task.create({
      data: {
        title: 'バグ修正',
        description: 'ログイン画面のバグを修正',
        status: 'in_progress',
        priority: 'medium',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        startDate: new Date(),
        estimatedHours: 8,
        assignee: 'テスト花子',
        category: 'development',
        tags: 'バグ,開発',
        progress: 30,
        userId: user.id,
        customerId: customers[0].id
      }
    }),
    prisma.task.create({
      data: {
        title: '顧客ミーティング',
        description: '月次定例会議',
        status: 'completed',
        priority: 'low',
        completedAt: new Date(),
        estimatedHours: 2,
        actualHours: 2.5,
        assignee: 'テスト太郎',
        category: 'meeting',
        tags: 'ミーティング',
        progress: 100,
        userId: user.id,
        customerId: customers[1].id
      }
    })
  ])
  console.log(`✅ ${tasks.length}件のタスクデータ作成完了`)

  // 3. リードデータ作成
  console.log('\n📝 リードデータ作成中...')
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        name: 'リード田中',
        email: 'tanaka@leadcompany.com',
        phone: '03-1234-5678',
        company: 'リード株式会社',
        source: 'website',
        status: 'new',
        score: 80,
        notes: 'ウェブサイトから問い合わせ',
        userId: user.id
      }
    }),
    prisma.lead.create({
      data: {
        name: 'リード佐藤',
        email: 'sato@prospect.com',
        phone: '06-9876-5432',
        company: 'プロスペクト社',
        source: 'referral',
        status: 'contacted',
        score: 60,
        notes: '既存顧客からの紹介',
        userId: user.id
      }
    })
  ])
  console.log(`✅ ${leads.length}件のリードデータ作成完了`)

  // 4. 商談データ作成
  console.log('\n📝 商談データ作成中...')
  const opportunities = await Promise.all([
    prisma.opportunity.create({
      data: {
        name: 'ERPシステム導入案件',
        amount: 5000000,
        stage: 'proposal',
        probability: 60,
        closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        description: '大規模ERPシステムの導入案件',
        userId: user.id,
        customerId: customers[0].id
      }
    }),
    prisma.opportunity.create({
      data: {
        name: 'クラウド移行プロジェクト',
        amount: 3000000,
        stage: 'negotiation',
        probability: 80,
        closeDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        description: 'オンプレミスからクラウドへの移行',
        userId: user.id,
        customerId: customers[1].id
      }
    })
  ])
  console.log(`✅ ${opportunities.length}件の商談データ作成完了`)

  console.log('\n✨ テストデータの投入完了!')
  console.log('ログイン情報:')
  console.log('  Email: test@example.com')
  console.log('  Password: password123')
}

main()
  .catch((e) => {
    console.error('❌ エラーが発生しました:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })