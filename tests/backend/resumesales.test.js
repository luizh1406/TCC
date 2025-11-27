import { resultFetch } from "../../src/utils/dafaults.fn";

async function resumeSales(setSales, setLastSales, setAllSales, setFilteredSale) {
  const salesRes = await fetch("/api/get/resume/sales");
  const sales = await resultFetch(salesRes);
  const allSalesRes = await fetch("/api/get/all_sales");
  const allSales = await resultFetch(allSalesRes);
  await setLastSales(sales);
  await setSales(sales);
  await setAllSales(allSales);
  await setFilteredSale(allSales);
}

// ✅ Mock corrigido
global.fetch = jest.fn((url) =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        props: {
          resultRows: url.includes("resume") ? ["sale1"] : ["sale2"],
        },
      }),
  })
);

describe("📊 resumeSales", () => {
  it("atualiza estados corretamente após fetch", async () => {
    const sets = [jest.fn(), jest.fn(), jest.fn(), jest.fn()];
    await resumeSales(...sets);

    // resumeSales chama setLastSales e setSales com o resultado do primeiro fetch
    expect(sets[0]).toHaveBeenCalledWith(["sale1"]);
    expect(sets[1]).toHaveBeenCalledWith(["sale1"]);

    // e setAllSales e setFilteredSale com o segundo
    expect(sets[2]).toHaveBeenCalledWith(["sale2"]);
    expect(sets[3]).toHaveBeenCalledWith(["sale2"]);
  });
});
