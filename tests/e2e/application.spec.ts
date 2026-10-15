import { test, expect } from "@playwright/test";
test("home, mobile layout, navigation and financial dashboard", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Uma cidade melhor/ }),
  ).toBeVisible();
  await expect(
    page.getByText(/Valores, empresas e obras fictícios/),
  ).toBeVisible();
  await page.getByRole("link", { name: "Explorar transparência" }).click();
  await expect(page.getByText("R$ 5.220.000", { exact: true })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
});
test("work filters and empty state, details and not found", async ({
  page,
}) => {
  await page.goto("/obras");
  await page
    .getByRole("combobox", { name: "Bairro", exact: true })
    .selectOption("Fragata");
  await expect(page.getByRole("status")).toContainText("1 resultado");
  await page.getByRole("link", { name: /Ampliação de unidade/ }).click();
  await expect(
    page.getByRole("heading", { name: "Contrato relacionado" }),
  ).toBeVisible();
  await expect(page.getByText(/Não existe documento oficial/)).toBeVisible();
  await page.goto("/obras");
  await page.getByLabel("Pesquisar").fill("impossivel");
  await expect(
    page.getByText("Nenhum resultado para estes filtros."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(page.getByRole("status")).toContainText("4 resultado");
  await page.goto("/obras/inexistente");
  await expect(
    page.getByRole("heading", { name: "Registro não encontrado" }),
  ).toBeVisible();
});
test("contracts combine filters without hiding demo provenance", async ({
  page,
}) => {
  await page.goto("/contratos");
  await page
    .getByRole("combobox", { name: "Assunto", exact: true })
    .selectOption("Educação");
  await expect(page.getByRole("row")).toHaveCount(2);
  await expect(page.getByText("Empresa demonstrativa 3")).toBeVisible();
});
test("participation demo validates but never claims persistence", async ({
  page,
}) => {
  await page.goto("/participar");
  await page.getByLabel("Título", { exact: true }).fill("Ocorrência fictícia");
  await page.getByLabel("Bairro", { exact: true }).fill("Centro");
  await page
    .getByLabel("O que você observou?")
    .fill("Texto fictício para validar o formulário local.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Validar demonstração" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Nada foi salvo ou enviado",
  );
});
test("LAI demo explains official protocol requirement", async ({ page }) => {
  await page.goto("/lai");
  await page.getByLabel("Título", { exact: true }).fill("Pedido fictício");
  await page.getByLabel("Órgão destinatário").fill("Órgão de demonstração");
  await page
    .getByLabel("Informação solicitada")
    .fill("Solicito informação fictícia para testar o fluxo.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Validar demonstração" }).click();
  await expect(page.getByRole("status")).toContainText("Nada foi salvo");
  await expect(page.getByText(/não inicia prazo legal/)).toBeVisible();
});
test("admin and write APIs deny unauthenticated and cross-origin requests", async ({
  page,
  request,
}) => {
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Área administrativa protegida" }),
  ).toBeVisible();
  for (const route of [
    "occurrences",
    "lai",
    "admin/import",
    "admin/moderate",
  ]) {
    const denied = await request.post("/api/" + route, {
      headers: { Origin: "https://other.invalid" },
    });
    expect(denied.status()).toBe(403);
    const anon = await request.post("/api/" + route, {
      headers: { Origin: "http://127.0.0.1:3000" },
    });
    expect(anon.status()).toBe(401);
  }
  await page.goto("/conta");
  await expect(
    page.getByRole("button", { name: "Entrar", exact: true }),
  ).toBeDisabled();
});
test("PWA manifest, offline fallback and security headers", async ({
  page,
  context,
  request,
}) => {
  const response = await request.get("/");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest.icons).toHaveLength(2);
  await page.goto("/");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Você está sem conexão" }),
  ).toBeVisible();
  await context.setOffline(false);
});
