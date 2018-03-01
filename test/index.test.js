'use strict';

const ROOT_PATH = '../';

const MODULE_PATH = 'index';

const FULL_MODULE_PATH = ROOT_PATH + MODULE_PATH;

const expect = require( 'chai' ).expect;

const proxyquire = require( 'proxyquire' ).noCallThru();

const sinon = require( 'sinon' );


describe( MODULE_PATH, function() {

    let getConfiguredInitialStateStub;

    let getStateKeyMapperStub;

    let getStateStorageComponentStub;

    function getModule( values ) {

        getConfiguredInitialStateStub = sinon.stub().returns(

            values.getConfiguredInitialStateResults
        );

        getStateKeyMapperStub = sinon.stub().returns(

            values.getStateKeyMapperResults
        );

        getStateStorageComponentStub = sinon.stub().returns(

            values.getStateStorageComponentResults
        );

        const mockLibIndex = {

            getStateStorageComponent: getStateStorageComponentStub,

            getConfiguredInitialState: getConfiguredInitialStateStub,

            getGlobalStateStorageInstance: function() {

                return {

                    globalStateStorageInstance: 'yes',
                };
            },
            getStateKeyMapper: getStateKeyMapperStub,
            getState: function() {

                return {

                    getState: 'yes',
                    self: this
                };
            },
            setState: function() {

                return {

                    setState: 'yes',
                    self: this
                };
            },
        };

        const proxyquireStubs = {

            './lib/index.js': mockLibIndex,
        };

        return proxyquire( FULL_MODULE_PATH, proxyquireStubs );
    }

    it( 'normal operation', function() {

        const initialState = [

            {
                theInitialState: 'yep'
            },
        ];

        const ReduxX = getModule({

            getStateKeyMapperResults: {

                stateKeyMapper: 'yea'
            },

            getConfiguredInitialStateResults: initialState,
        });

        const reduxX = ReduxX({

            initialState
        });

        expect( getConfiguredInitialStateStub.args.length ).to.equal( 1 );
        expect( getConfiguredInitialStateStub.args[0].length ).to.equal( 1 );
        expect( getConfiguredInitialStateStub.args[0][0] ).to.eql({

            initialState: [

                {
                    theInitialState: 'yep'
                },
            ],
        });


        expect( getStateStorageComponentStub.args.length ).to.equal( 1 );
        expect( getStateStorageComponentStub.args[0].length ).to.equal( 1 );
        expect( getStateStorageComponentStub.args[0][0] ).to.eql({

            reduxXCore: {},
            initialState: [

                {
                    theInitialState: 'yep'
                },
            ],
            stateKeyMapper: {

                stateKeyMapper: 'yea'
            },
        });

        expect( getStateKeyMapperStub.args.length ).to.equal( 1 );
        expect( getStateKeyMapperStub.args[0].length ).to.equal( 1 );
        expect( getStateKeyMapperStub.args[0][0] ).to.eql({

            initialState: [

                {
                    theInitialState: 'yep'
                },
            ],
        });

        const globalStateStorageInstanceResult = reduxX.globalStateStorageInstance;

        expect( globalStateStorageInstanceResult ).eql({

            globalStateStorageInstance: 'yes',
        });

        const getStateResult = reduxX.getState();

        expect( getStateResult ).eql({

            getState: 'yes',
            self: {

                reduxXCore: {},
                stateKeyMapper: {

                    stateKeyMapper: 'yea'
                },
            }
        });

        const setStateResult = reduxX.setState();

        expect( setStateResult ).eql({

            setState: 'yes',
            self: {

                reduxXCore: {},
                stateKeyMapper: {

                    stateKeyMapper: 'yea'
                },
            }
        });
    });
});
