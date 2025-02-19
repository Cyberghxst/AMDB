export function enforceRequiredArgs(
	givenValues: string[],
	expectedValues: string[]
) {
	return givenValues < expectedValues
}
