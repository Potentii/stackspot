// import { describe, it } from "node:test";
import Stackspot from "./stackspot.mjs";

describe('Stackspot', () => {

	it('Should provide a global instance', t => {
		expect(Stackspot.instance).toEqual(Stackspot.instance);
	});


	it('Should auto configure with environment variables', t => {
		process.env.STACKSPOT_CLIENT_ID = `test-client-id`;
		process.env.STACKSPOT_CLIENT_SECRET = `test-client-secret`;
		process.env.STACKSPOT_REALM = `test-realm`;

		Stackspot.instance.config();

		expect(Stackspot.instance.clientId).toBe(`test-client-id`);
		expect(Stackspot.instance.clientSecret).toBe(`test-client-secret`);
		expect(Stackspot.instance.realm).toBe(`test-realm`);
	});


	it('Should use provided configuration instead of environment variables', t => {
		process.env.STACKSPOT_CLIENT_ID = `test-client-id`;
		process.env.STACKSPOT_CLIENT_SECRET = `test-client-secret`;
		process.env.STACKSPOT_REALM = `test-realm`;

		Stackspot.instance.config({
			clientId: `test-client-id-2`,
			clientSecret: `test-client-secret-2`,
		});

		expect(Stackspot.instance.clientId).toBe(`test-client-id-2`);
		expect(Stackspot.instance.clientSecret).toBe(`test-client-secret-2`);
		expect(Stackspot.instance.realm).toBe(`test-realm`);
	});



});

