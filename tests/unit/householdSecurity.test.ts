import test from "node:test";
import assert from "node:assert/strict";

function checkUserAccess(resourceUserId: string, requestingUserId: string): boolean {
  if (!resourceUserId || !requestingUserId) return false;
  return resourceUserId === requestingUserId;
}

function checkHouseholdAccess(
  resourceHouseholdId: string,
  userHouseholdId: string,
  userRole: "owner" | "member" | "guest" = "member"
): boolean {
  if (!resourceHouseholdId || !userHouseholdId) return false;
  if (resourceHouseholdId !== userHouseholdId) return false;
  return userRole === "owner" || userRole === "member";
}

test("IDOR check prevents cross-user access to receipts", () => {
  const aliceUserId = "user-alice-123";
  const bobUserId = "user-bob-456";

  const aliceReceiptOwner = aliceUserId;
  assert.equal(checkUserAccess(aliceReceiptOwner, aliceUserId), true);
  assert.equal(checkUserAccess(aliceReceiptOwner, bobUserId), false);
});

test("Household permission check isolates separate household accounts", () => {
  const smithHousehold = "hh-smiths";
  const jonesHousehold = "hh-joneses";

  assert.equal(checkHouseholdAccess(smithHousehold, smithHousehold, "owner"), true);
  assert.equal(checkHouseholdAccess(smithHousehold, jonesHousehold, "owner"), false);
  assert.equal(checkHouseholdAccess(smithHousehold, smithHousehold, "guest"), false);
});
