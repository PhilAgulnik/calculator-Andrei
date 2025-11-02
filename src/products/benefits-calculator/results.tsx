import { Page } from '~/products/shared/Page'
import { Alert } from '~/components/Alert'

export function Results() {
  // Mock data - in a real application this would come from form submission
  const totalBenefits = 1305.98
  const universalCredit = 1229.41
  const councilTaxReduction = 76.57
  const paymentPeriod = 'monthly'

  return (
    <>
      <Page.Main>
        <h1 className="text-3xl font-bold mb-6">Results</h1>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-blue-50 p-4 rounded-t-lg">
            <h2 className="text-2xl font-bold">Total benefits entitlement</h2>
            <div className="text-3xl font-bold text-blue-600">
              £{totalBenefits.toFixed(2)}
              <span className="text-lg text-gray-600 ml-2">/ {paymentPeriod}</span>
            </div>
          </div>

          <div className="p-6">
            <p className="mb-4">
              Our estimate is based on the information you have entered and does not guarantee
              entitlement. It uses 2025/26 benefit and tax rates.
            </p>
            <p className="font-semibold">This amount is made up of the following benefits:</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Universal Credit */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b">
              <h3 className="text-xl font-bold">Universal Credit</h3>
              <div className="text-2xl font-bold text-blue-600">
                £{universalCredit.toFixed(2)}
                <span className="text-sm text-gray-600 ml-2">/ {paymentPeriod}</span>
              </div>
            </div>
            <div className="p-4">
              <Alert type="warning">
                <strong>You are affected by the benefit cap</strong>
              </Alert>
              <p className="mt-4 mb-4">
                We estimate your monthly Universal Credit award will be £{universalCredit.toFixed(2)}.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                  How we worked it out
                </a>
                <a
                  href="https://www.citizensadvice.org.uk/scotland/benefits/universal-credit/claiming/helptoclaim/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Help to Claim service
                </a>
                <a
                  href="https://www.entitledto.co.uk/help/universal-credit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  More information
                </a>
              </div>
            </div>
          </div>

          {/* Council Tax Reduction */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b">
              <h3 className="text-xl font-bold">Council Tax Reduction</h3>
              <div className="text-2xl font-bold text-blue-600">
                £{councilTaxReduction.toFixed(2)}
                <span className="text-sm text-gray-600 ml-2">/ {paymentPeriod}</span>
              </div>
            </div>
            <div className="p-4">
              <p className="mb-4">
                You should not have to pay Council Tax as you qualify for full Council Tax
                Reduction.
              </p>
              <p className="mb-4">
                You still have to pay the water and sewerage charges. If you claim Council Tax
                Reduction (CTR), you should also get a reduction of up to 35% on the public water
                and sewerage charges on your council tax bill through the Water Charges Reduction
                Scheme.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                  How we worked it out
                </a>
                <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                  More information
                </a>
                <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                  How to claim?
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Benefit Cap Information */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
          <div className="p-4 border-b">
            <h3 className="text-xl font-bold">Affected by Benefit Cap</h3>
          </div>
          <div className="p-4">
            <h4 className="font-semibold mb-2">You are affected by the benefit cap.</h4>
            <p className="mb-4">
              You may get a 39 week 'grace period' before the benefit cap is applied if you aren't
              working now but had been working for at least 16 hours a week for 50 out of the 52
              weeks immediately before you stopped working. To find out more about this and other
              exemptions see our Benefit cap help page.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-2xl font-bold text-gray-700">£1700.14</div>
                <div className="text-sm text-gray-600">
                  Estimated Universal Credit before benefits cap
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-2xl font-bold text-red-600">£{universalCredit.toFixed(2)}</div>
                <div className="text-sm text-gray-600">
                  Estimated Universal Credit after benefits cap
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Entitlements */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
          <div className="p-4 border-b">
            <h3 className="text-xl font-bold">Other Entitlements</h3>
          </div>
          <div className="p-4">
            <p className="mb-4">
              We have used the information you provided to search for other entitlements you may
              qualify for. Get more information about:
            </p>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                  Extra help from the Scottish Welfare Fund
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                  Funeral Expense Assistance
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                  NHS costs - Prescriptions, Eye Tests and Dental
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                  Discretionary Housing Payment
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                  Warm Homes Discount
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                  Lower cost broadband
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Better Off Calculator */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
          <div className="p-4 border-b">
            <h3 className="text-xl font-bold">How much better off would you be in work?</h3>
          </div>
          <div className="p-4">
            <p className="mb-4">
              Use the better off calculator by entering details of the job you are thinking about.
              We will take this information and calculate how much you will earn after tax and if
              you qualify for in-work benefits.
            </p>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-700">
                Better off calculator functionality would be available here in the full
                implementation.
              </p>
            </div>
          </div>
        </div>
      </Page.Main>
    </>
  )
}
