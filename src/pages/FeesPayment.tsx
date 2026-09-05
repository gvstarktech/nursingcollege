import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CreditCard, Shield, Clock, CheckCircle, Phone, Mail, HelpCircle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { supabase } from '../lib/supabase';

interface ContentMap {
  [key: string]: { title?: string; subtitle?: string; content?: string; extra_data?: Record<string, unknown> };
}

export default function FeesPayment() {
  const [content, setContent] = useState<ContentMap>({});

  const CCAVENUE_PAYMENT_URL = 'https://formbuilder.ccavenue.com/live/city-union-bank/mahalakshmi-college-of-nursing';

  useEffect(() => {
    supabase.from('page_content').select('*').eq('page', 'fees').then(({ data }) => {
      if (data) {
        const map: ContentMap = {};
        data.forEach((item) => { map[item.section] = item; });
        setContent(map);
      }
    });
  }, []);

  const hero = content['hero'];

  return (
    <div className="page-enter bg-gray-50 min-h-screen">
      <SEO 
        title="Online Fees Payment Portal | Mahalakshmi College of Nursing"
        description="Official City Union Bank online fee payment portal for Mahalakshmi College of Nursing, Trichy. Pay tuition fees, hostel fees, and admission fees securely via CCAvenue."
        canonicalUrl="https://mahalakshmicollegeofnursing.com/fees"
        keywords={['Mahalakshmi College of Nursing', 'Mahalakshmi Nursing Fee Payment', 'City Union Bank Fee Portal', 'Online Fee Payment CCAvenue']}
      />

      {/* Hero */}
      <section className="relative py-24 text-white overflow-hidden bg-primary-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-green-400 font-semibold text-sm uppercase tracking-widest mb-3">
            {hero?.subtitle ?? 'Official Online Fee Payment Portal'}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold mb-4">
            {hero?.title ?? 'Online Fee Payment'}
          </h1>
          <p className="text-gray-200 max-w-2xl mx-auto leading-relaxed text-base sm:text-lg">
            {hero?.content ?? 'Pay your tuition fees, hostel fees, and admission charges securely through the official City Union Bank & CCAvenue payment gateway.'}
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={CCAVENUE_PAYMENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-500 text-white font-bold text-base px-8 py-4 rounded-xl shadow-xl flex items-center gap-3 transition-all hover:scale-105"
            >
              <CreditCard size={20} /> Pay Online Now (City Union Bank / CCAvenue) ↗
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-300">
            <Link to="/" className="hover:text-green-300">Home</Link>
            <ChevronRight size={14} />
            <span className="text-green-300">Fee Payment</span>
          </div>
        </div>
      </section>

      {/* Prominent Direct Redirect Banner */}
      <section className="py-6 bg-gradient-to-r from-green-600 to-primary-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Shield size={26} className="text-green-200" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg">City Union Bank & CCAvenue Payment Gateway</h3>
              <p className="text-xs text-green-100">Official, 256-bit SSL Encrypted Online Payment Portal for Mahalakshmi College of Nursing</p>
            </div>
          </div>
          <a
            href={CCAVENUE_PAYMENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-primary-900 hover:bg-green-50 font-extrabold text-sm px-6 py-3 rounded-xl shadow-md transition-all hover:scale-105 flex-shrink-0"
          >
            Open Official Payment Portal ↗
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 bg-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
            {[
              { icon: Shield, label: 'Secure Payment', sub: 'City Union Bank Gateway' },
              { icon: Clock, label: 'Instant Confirmation', sub: 'Official Email & SMS Receipt' },
              { icon: CreditCard, label: 'Multiple Payment Modes', sub: 'UPI, GPay, Cards, NetBanking' },
              { icon: CheckCircle, label: '24/7 Availability', sub: 'Pay Anytime Online' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon size={22} />
                <div className="font-semibold text-sm">{label}</div>
                <div className="text-green-100 text-xs">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct Online Payment Card & Steps */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-xl text-center">
            <div className="w-20 h-20 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100">
              <CreditCard size={36} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-3">
              Official City Union Bank & CCAvenue Fee Portal
            </h2>

            <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Mahalakshmi College of Nursing provides a secure direct online payment portal. You can easily pay college tuition fees, admission booking fees, and hostel charges using any UPI app (GPay / PhonePe / Paytm), Debit/Credit Cards, or Net Banking.
            </p>

            <div className="max-w-lg mx-auto bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 text-left">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <HelpCircle size={16} className="text-green-600" />
                How to Pay Online in 3 Simple Steps:
              </h3>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>Click the <strong>Proceed to Payment Portal</strong> button below.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>Enter student name, registration/application number, course, and amount.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>Select your preferred payment method (UPI / Card / NetBanking) and complete payment. Save the generated official receipt.</span>
                </li>
              </ol>
            </div>

            <a
              href={CCAVENUE_PAYMENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 text-base sm:text-lg font-bold px-10 py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white shadow-xl hover:shadow-green-600/30 transition-all hover:scale-105"
            >
              <CreditCard size={22} /> Proceed to Official Payment Portal (CCAvenue) ↗
            </a>

            <div className="flex items-center justify-center gap-2 mt-5 text-xs text-gray-500">
              <Shield size={14} className="text-green-600" />
              Secured with 256-Bit SSL Encryption powered by City Union Bank
            </div>
          </div>
        </div>
      </section>

      {/* Accounts & Helpdesk Contact */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">
            Need Help with Fee Payment or Accounts Verification?
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            For fee receipts, scholarship concessions, or transaction queries, please reach out to our accounts department:
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="tel:+917358873106" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-100 hover:bg-green-50 text-gray-800 hover:text-green-800 font-semibold transition-colors">
              <Phone size={16} className="text-green-600" />
              Accounts Helpline: +91 73588 73106
            </a>
            <a href="mailto:info@mahalakshmicollegeofnursing.com" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-100 hover:bg-green-50 text-gray-800 hover:text-green-800 font-semibold transition-colors">
              <Mail size={16} className="text-green-600" />
              info@mahalakshmicollegeofnursing.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
