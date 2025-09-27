// API テストスクリプト
const BASE_URL = 'http://localhost:3000';

async function testAPIs() {
  console.log('🧪 APIテスト開始...\n');
  
  // 1. 顧客作成テスト
  console.log('📝 顧客作成テスト...');
  try {
    const customerRes = await fetch(`${BASE_URL}/api/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'テスト顧客',
        email: 'test@example.com',
        phone: '090-1234-5678',
        company: 'テスト株式会社',
        status: 'active',
        contractDate: new Date().toISOString(),
        contractAmount: 1000000
      })
    });
    
    if (!customerRes.ok) {
      const error = await customerRes.text();
      console.error('❌ 顧客作成失敗:', error);
    } else {
      const customer = await customerRes.json();
      console.log('✅ 顧客作成成功:', customer.name);
      
      // 2. タスク作成テスト
      console.log('\n📝 タスク作成テスト...');
      const taskRes = await fetch(`${BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'テストタスク',
          description: 'これはテストタスクです',
          status: 'not_started',
          priority: 'high',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          startDate: new Date().toISOString(),
          estimatedHours: 8,
          assignee: 'テスト担当者',
          category: 'development',
          tags: 'テスト,急ぎ',
          progress: 0,
          customerId: customer.id
        })
      });
      
      if (!taskRes.ok) {
        const error = await taskRes.text();
        console.error('❌ タスク作成失敗:', error);
      } else {
        const task = await taskRes.json();
        console.log('✅ タスク作成成功:', task.title);
      }
      
      // 3. リード作成テスト
      console.log('\n📝 リード作成テスト...');
      const leadRes = await fetch(`${BASE_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'テストリード',
          email: 'lead@example.com',
          phone: '080-9876-5432',
          company: 'リード会社',
          source: 'website',
          status: 'new',
          score: 75
        })
      });
      
      if (!leadRes.ok) {
        const error = await leadRes.text();
        console.error('❌ リード作成失敗:', error);
      } else {
        const lead = await leadRes.json();
        console.log('✅ リード作成成功:', lead.name);
      }
      
      // 4. 商談作成テスト
      console.log('\n📝 商談作成テスト...');
      const opportunityRes = await fetch(`${BASE_URL}/api/opportunities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'テスト商談',
          amount: 5000000,
          stage: 'proposal',
          probability: 60,
          closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'これはテスト商談です',
          customerId: customer.id
        })
      });
      
      if (!opportunityRes.ok) {
        const error = await opportunityRes.text();
        console.error('❌ 商談作成失敗:', error);
      } else {
        const opportunity = await opportunityRes.json();
        console.log('✅ 商談作成成功:', opportunity.name);
      }
      
      // 5. 各エンドポイントのGETテスト
      console.log('\n📖 データ取得テスト...');
      const endpoints = [
        '/api/customers',
        '/api/tasks',
        '/api/leads',
        '/api/opportunities',
        '/api/dashboard/stats'
      ];
      
      for (const endpoint of endpoints) {
        const res = await fetch(`${BASE_URL}${endpoint}`);
        if (res.ok) {
          const data = await res.json();
          console.log(`✅ ${endpoint}: データ取得成功 (${Array.isArray(data) ? data.length + '件' : 'OK'})`);
        } else {
          console.error(`❌ ${endpoint}: データ取得失敗`);
        }
      }
    }
  } catch (error) {
    console.error('❌ テスト中にエラーが発生しました:', error);
  }
  
  console.log('\n✨ APIテスト完了');
}

// テスト実行
testAPIs();