/* 
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.

   Before using, initialize the state by using init_genrand(seed)  
   or init_by_array(init_key, key_length).

   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.                          

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:

     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.

     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

     3. The names of its contributors may not be used to endorse or promote 
        products derived from this software without specific prior written 
        permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/

// Modified to better fit javascript
// Added comments

var MersenneTwister = function(seed) {

	var N 			= 624;
	var M 			= 397;
	var MATRIX_A 	= 0x9908b0df; /* constant vector a */
	var UPPER_MASK 	= 0x80000000; /* most significant w-r bits */
	var LOWER_MASK 	= 0x7fffffff; /* least significant r bits */

	var mt 			= new Array(N); /* the array for the state vector */
	var mti 		= N+1; /* mti==N+1 means mt[N] is not initialized */
	
	/**
		Set random seed
		@param seed {Number}
		@param seed {Array}
	**/
	this.setSeed = function(seed) {
		var s;
		
		// set seed from number
		if (Number.isFinite(seed)) {
			mt[0]= seed >>> 0;
			
			for(mti=1; mti<N; mti++) {
				s = mt[mti-1] ^ (mt[mti-1] >>> 30);
				mt[mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + mti;
				mt[mti] >>>= 0;
			}
			
		// set seed from vector
		} else if (Array.isArray(seed)) {
			var len = seed.length;
			var i = 1;
			var j = 0;
			this.setSeed(19650218);
			var k = (N > len ? N : len);
			for (; k; k--) {
				s = mt[i-1] ^ (mt[i-1] >>> 30);
				mt[i] = (mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525))) + seed[j] + j;
				mt[i] >>>= 0;
				
				i += 1; j += 1;
				if (i >= N) { mt[0] = mt[N-1]; i=1; }
				if (j >= len) { j=0; }
			}
			for (k = N-1; k; k--) {
				s = mt[i-1] ^ (mt[i-1] >>> 30);
				mt[i] = (mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941)) - i;
				mt[i] >>>= 0;
				
				i += 1;
				if (i>=N) { mt[0] = mt[N-1]; i=1; }
			}

			mt[0] = 0x80000000;
			
		// unknown seed
		} else {
			throw new TypeError("Expected number or array");
		}
	};
	
	// initialize seed
	this.setSeed(seed || 5489);
	
	/**
		Generate a number on the [0x0, 0xffffffff] interval
	**/
	var rand = this.random32 = function() {
		var y;
		var mag01 = [0, MATRIX_A];
		/* mag01[x] = x * MATRIX_A  for x=0,1 */

		if (mti >= N) { /* generate N words at one time */
			var kk;

			for (kk=0;kk<N-M;kk++) {
				y = (mt[kk] & UPPER_MASK)|(mt[kk+1] & LOWER_MASK);
				mt[kk] = mt[kk+M] ^ (y >>> 1) ^ mag01[y & 0x1];
			}
			for (;kk<N-1;kk++) {
				y = (mt[kk] & UPPER_MASK)|(mt[kk+1] & LOWER_MASK);
				mt[kk] = mt[kk+(M-N)] ^ (y >>> 1) ^ mag01[y & 0x1];
			}
			y = (mt[N-1] & UPPER_MASK)|(mt[0] & LOWER_MASK);
			mt[N-1] = mt[M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

			mti = 0;
		}
	  
		y = mt[mti++];

		y ^= (y >>> 11);
		y ^= (y << 7) & 0x9d2c5680;
		y ^= (y << 15) & 0xefc60000;
		y ^= (y >>> 18);

		return y >>> 0;
		
	};
	
	/** 
		Generate a number on the [0x0, 0x7fffffff] interval
	**/
	this.random31 = function() {
		return rand() >>> 1;
	};
	
	/**
		Generate a number on the [0x0, 0x1] interval
	**/
	this.randomReal1 = function() {
		return rand() * (1.0 / 4294967295.0);
	};
	
	/**
		Generate a number on the [0x0, 0x1) interval
	**/
	this.randomReal2 = function() {
		return rand() * (1.0 / 4294967296.0); 
	};
	
	/**
		Generate a number on the (0x0, 0x1) interval
	**/
	this.randomReal3 = function() {
		return (rand() + 0.5)*(1.0/4294967296.0); 
	};
	
	/**
		Generate a number on [0,1) with 53-bit resolution
	**/
	this.randomResolution53 = function() { 
		var a = rand()>>>5, b = rand()>>>6; 
		return(a*67108864.0+b)*(1.0/9007199254740992.0); 
	};
	
};

MersenneTwister.create = function(seed) {
	return new MersenneTwister(seed);
};

module.exports = MersenneTwister;