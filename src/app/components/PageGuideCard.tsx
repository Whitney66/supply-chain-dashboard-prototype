import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

type PageGuideCardProps = {
  page: 'detail' | 'exception';
};

export function PageGuideCard({ page }: PageGuideCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const title = page === 'detail' ? '指标明细说明' : '异常明细说明';

  return (
    <section className="mb-5 overflow-hidden rounded-lg border border-amber-400 bg-white">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-4 bg-amber-300 px-5 py-3 text-left text-gray-900 transition-colors hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-inset"
      >
        <span className="text-base font-bold">{title}</span>
        <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-amber-950">
          {isOpen ? '收起' : '展开'}
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {isOpen && (
        <div className="space-y-5 px-6 py-5 text-sm leading-7 text-slate-700">
          {page === 'detail' ? <IndicatorDetailGuide /> : <ExceptionDetailGuide />}
        </div>
      )}
    </section>
  );
}

function GuideHeading({ children }: { children: ReactNode }) {
  return <h3 className="text-base font-bold text-slate-900">{children}</h3>;
}

function IndicatorDetailGuide() {
  return (
    <>
      <div className="space-y-2">
        <GuideHeading>一、筛选项</GuideHeading>
        <dl className="grid gap-x-6 gap-y-1 md:grid-cols-[88px_1fr]">
          <dt className="font-semibold text-slate-900">搜索框</dt>
          <dd>对应指标名称。</dd>
          <dt className="font-semibold text-slate-900">指标类型</dt>
          <dd>时效指标、质量指标、效率指标等指标类型下所有的数据指标。</dd>
          <dt className="font-semibold text-slate-900">业务环节</dt>
          <dd>订货段、分货段、门店段下的所有数据指标。</dd>
        </dl>
      </div>

      <div className="space-y-2">
        <GuideHeading>二、指标折线图说明</GuideHeading>
        <ol className="list-decimal space-y-1 pl-5 marker:font-semibold">
          <li>横轴为时间，纵轴为票数或者件数；票数表示订单数量，件数表示商品数量。</li>
          <li>所有虚线都代表目标值，实线表示真实值。如果没有目标值，则不存在虚线。</li>
        </ol>
      </div>

      <div className="space-y-2">
        <GuideHeading>三、指标表格说明</GuideHeading>
        <ol className="list-decimal space-y-3 pl-5 marker:font-semibold">
          <li>
            每月按销售日期的开始时间至结束时间连续展示。
            <div className="mt-2 border-l-4 border-amber-400 bg-amber-50 px-4 py-2.5">
              <p><span className="font-semibold text-slate-900">不跨年：</span>列头从销售日期开始月份展示至结束月份，例如“3月、4月、5月”。</p>
              <p><span className="font-semibold text-slate-900">跨年：</span>列头明确展示年份，例如“2025年11月、2025年12月、2026年1月”。</p>
            </div>
          </li>
          <li>【近八周】以所选时间的开始时间为基准，并往前平移八周的每周数据。</li>
        </ol>
        <p className="border-l-4 border-amber-400 bg-amber-50 px-4 py-2.5">
          <span className="font-semibold text-slate-900">月度均值：</span>
          月度均值为所选时间范围对应指标的总数/含总月数。
        </p>
      </div>
    </>
  );
}

function ExceptionDetailGuide() {
  const fields = [
    ['指标名称', '仅展示存在异常订单的指标。'],
    ['门店', '同筛选项门店清单。'],
    ['单号', '订单号，不同指标对应的单号不同。对应的票数取数规则，有的是入库预约单，有的是提货单。'],
    ['件数', '商品数量。'],
    ['开始时间', '时效指标计算逻辑的开始时间。'],
    ['结束时间', '时效指标计算逻辑的开始时间。'],
    ['单据类型', '枚举值，“先报后入”或者“先入后报”。仅需要根据通关类型划分的指标才能展示，不区分通关类型的指标展示为“-”。'],
    ['实际时长', '指标的时效指标数据。'],
    ['标准时长', '每个时效指标的目标值。'],
    ['所属品类', '枚举值，香化或者酒水；不区分品类的展示“-”，表示全部品类。'],
    ['订单状态', '枚举值，表示订单进行中或者已完成。'],
  ];

  return (
    <>
      <div className="space-y-2">
        <GuideHeading>一、异常明细</GuideHeading>
        <p>展示每个指标下不达标的订单。</p>
        <div className="border-l-4 border-amber-400 bg-amber-50 px-4 py-3">
          <p><span className="font-semibold text-slate-900">【订单状态】</span>枚举值，默认全部，包括“已完成”和“进行中”，判断依据为“结束时间”是否为空。</p>
          <p><span className="font-semibold text-slate-900">“已完成”：</span>结束时间不为空，计算指标时效，时效=结束时间-开始时间，如果时效大于目标值，则判定为“异常”。</p>
          <p><span className="font-semibold text-slate-900">“进行中”：</span>结束时间为空，则时效计算逻辑为时效=当前日期-开始日期，如果计算的时效大于目标值，也判定为“异常”。</p>
        </div>
      </div>

      <div className="space-y-2">
        <GuideHeading>二、列表展示字段</GuideHeading>
        <dl className="grid gap-x-6 gap-y-1 md:grid-cols-[88px_1fr]">
          {fields.map(([name, description]) => (
            <div key={name} className="contents">
              <dt className="font-semibold text-slate-900">{name}</dt>
              <dd>{description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
