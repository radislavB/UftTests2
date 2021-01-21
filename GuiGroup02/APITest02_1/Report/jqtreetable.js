/* 
Copyright: Paul Hanlon

Released under the MIT/BSD licence which means you can do anything you want 
with it, as long as you keep this copyright notice on the page 
*/
(function(jq){
  jq.fn.jqTreeTable=function(map, options){
    var opts = jq.extend({openImg:"",shutImg:"",leafImg:"",lastOpenImg:"",lastShutImg:"",lastLeafImg:"",vertLineImg:"",blankImg:"",collapse:false,column:0,striped:false,highlight:false,state:true},options),
    mapa=[],mapb=[],tid=this.attr("id"),collarr=[],
	  stripe=function(){
      if(opts.striped){
  		  $("#"+tid+" tr:visible").filter(":even").addClass("even").end().filter(":odd").removeClass("even");
      }
	  },
    buildText = function(parno, preStr){//Recursively build up the text for the images that make it work
      var mp=mapa[parno], ro=0, pre="", pref, img;
      for (var y=0,yl=mp.length;y<yl;y++){
        ro = mp[y];
        if (mapa[ro]){//It's a parent as well. Build it's string and move on to it's children
          pre=(y==yl-1)? opts.blankImg: opts.vertLineImg;
          img=(y==yl-1)? opts.lastOpenImg: opts.openImg;
          mapb[ro-1] = preStr + '<img src="'+img+'" class="parimg" id="'+tid+ro+'">';
          pref = preStr + '<img src="'+pre+'" class="preimg">';
          arguments.callee(ro, pref);
        }else{//it's a child
          img = (y==yl-1)? opts.lastLeafImg: opts.leafImg;//It's the last child, It's child will have a blank field behind it
          mapb[ro-1] = preStr + '<img src="'+img+'" class="ttimage" id="'+tid+ro+'">';
        }
      }
    },
    expandKids = function(num, last){//Expands immediate children, and their uncollapsed children
      jq("#"+tid+num).attr("src", (last)? opts.lastOpenImg: opts.openImg);//
      for (var x=0, xl=mapa[num].length;x<xl;x++){
        var mnx = mapa[num][x];
        jq("#"+tid+mnx).parents("tr").removeClass("collapsed");
  			if (mapa[mnx] && opts.state && jq.inArray(mnx, collarr)<0){////If it is a parent and its number is not in the collapsed array
          arguments.callee(mnx,(x==xl-1));//Expand it. More intuitive way of displaying the tree
        }
      }
    },
    collapseKids = function(num, last){//Recursively collapses all children and their children and change icon
      jq("#"+tid+num).attr("src", (last)? opts.lastShutImg: opts.shutImg);
      for (var x=0, xl=mapa[num].length;x<xl;x++){
        var mnx = mapa[num][x];
        jq("#"+tid+mnx).parents("tr").addClass("collapsed");
        if (mapa[mnx]){//If it is a parent
          arguments.callee(mnx,(x==xl-1));
        }
      }
    },
  	creset = function(num, exp){//Resets the collapse array
  		var o = (exp)? collarr.splice(jq.inArray(num, collarr), 1): collarr.push(num);
      cset(tid,collarr);
  	},
  	cget = function(n){
	  	var v='',c=' '+document.cookie+';',s=c.indexOf(' '+n+'=');
	    if (s>=0) {
	    	s+=n.length+2;
	      v=(c.substring(s,c.indexOf(';',s))).split("|");
	    }
	    return v||0;
  	},
    cset = function (n,v) {
  		jq.unique(v);
	  	document.cookie = n+"="+v.join("|")+";";
	  };
    for (var x=0,xl=map.length; x<xl;x++){//From map of parents, get map of kids
      num = map[x];
      if (!mapa[num]){
        mapa[num]=[];
      }
      mapa[num].push(x+1);
    }
    buildText(0,"");
    jq("tr", this).each(function(i){//Inject the images into the column to make it work
      jq(this).children("td").eq(opts.column).prepend(mapb[i]);
      
    });
		collarr = cget(tid)||opts.collapse||collarr;
		if (collarr.length){
			cset(tid,collarr);
	    for (var y=0,yl=collarr.length;y<yl;y++){
	      collapseKids(collarr[y],($("#"+collarr[y]+ " .parimg").attr("src")==opts.lastOpenImg));
	    }
		}
    stripe();
    jq(".parimg", this).each(function(i){
      var jqt = jq(this),last;
      jqt.click(function(){
        var num = parseInt(jqt.attr("id").substr(tid.length));//Number of the row
        if (jqt.parents("tr").next().is(".collapsed")){//If the table row directly below is collapsed
          expandKids(num, (jqt.attr("src")==opts.lastShutImg));//Then expand all children not in collarr
					if(opts.state){creset(num,true);}//If state is set, store in cookie
        }else{//Collapse all and set image to opts.shutImg or opts.lastShutImg on parents
          collapseKids(num, (jqt.attr("src")==opts.lastOpenImg));
					if(opts.state){creset(num,false);}//If state is set, store in cookie
        }
        stripe();//Restripe the rows
      });
    });
    if (opts.highlight){//This is where it highlights the rows
      jq("tr", this).hover(
        function(){jq(this).addClass("over");},
        function(){jq(this).removeClass("over");}
      );
    };
  };
  return this;
})(jQuery);

// SIG // Begin signature block
// SIG // MIIi0AYJKoZIhvcNAQcCoIIiwTCCIr0CAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // MqtnW6RLrOSGDtOQJDHk21B4zyGIse0tnkmjewFfRKWg
// SIG // ghGrMIIFajCCBFKgAwIBAgIRAPLFsUozokCKkwpn2QHj
// SIG // hvUwDQYJKoZIhvcNAQELBQAwfTELMAkGA1UEBhMCR0Ix
// SIG // GzAZBgNVBAgTEkdyZWF0ZXIgTWFuY2hlc3RlcjEQMA4G
// SIG // A1UEBxMHU2FsZm9yZDEaMBgGA1UEChMRQ09NT0RPIENB
// SIG // IExpbWl0ZWQxIzAhBgNVBAMTGkNPTU9ETyBSU0EgQ29k
// SIG // ZSBTaWduaW5nIENBMB4XDTE3MDExMzAwMDAwMFoXDTE4
// SIG // MDExMzIzNTk1OVowgdIxCzAJBgNVBAYTAlVTMQ4wDAYD
// SIG // VQQRDAU5NDMwNDELMAkGA1UECAwCQ0ExEjAQBgNVBAcM
// SIG // CVBhbG8gQWx0bzEcMBoGA1UECQwTMzAwMCBIYW5vdmVy
// SIG // IFN0cmVldDErMCkGA1UECgwiSGV3bGV0dCBQYWNrYXJk
// SIG // IEVudGVycHJpc2UgQ29tcGFueTEaMBgGA1UECwwRSFAg
// SIG // Q3liZXIgU2VjdXJpdHkxKzApBgNVBAMMIkhld2xldHQg
// SIG // UGFja2FyZCBFbnRlcnByaXNlIENvbXBhbnkwggEiMA0G
// SIG // CSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDPxxlFNiRQ
// SIG // 33xSPd7J0ZXLy7oUV02wNsc06YOZ7hAOw/ZT0ebeqcbT
// SIG // Lt/1WDcyRSlws3q45xeMQvBnB8PpKwqQMi+iJeB6VFzj
// SIG // osggYWSQt8C54B68dDU1SIuqStkPTBQo0d3R+wOGMFze
// SIG // pHdh1y9PqTNxbAarh732FPd9necXSG+YOS1Sx3YKF5P7
// SIG // uvXyQNr9bZzD0+2cTLLP+cv3VWSCOoi4KQChoHlav/0z
// SIG // EdUubraHHPCeBdSI7igz7dN/CVAk0rkzgNwzrQuJ+OGc
// SIG // 3cqEre4jqZz5/Hf35GHqDkScZdoTh/uehERkz7OTg6Hx
// SIG // jDtbIWyER+BS2Xe7MWm6K5LbAgMBAAGjggGNMIIBiTAf
// SIG // BgNVHSMEGDAWgBQpkWD/ik366/mmarjP+eZLvUnOEjAd
// SIG // BgNVHQ4EFgQU2dzvL45s+PiZeobFbNZJ4wge80QwDgYD
// SIG // VR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwEwYDVR0l
// SIG // BAwwCgYIKwYBBQUHAwMwEQYJYIZIAYb4QgEBBAQDAgQQ
// SIG // MEYGA1UdIAQ/MD0wOwYMKwYBBAGyMQECAQMCMCswKQYI
// SIG // KwYBBQUHAgEWHWh0dHBzOi8vc2VjdXJlLmNvbW9kby5u
// SIG // ZXQvQ1BTMEMGA1UdHwQ8MDowOKA2oDSGMmh0dHA6Ly9j
// SIG // cmwuY29tb2RvY2EuY29tL0NPTU9ET1JTQUNvZGVTaWdu
// SIG // aW5nQ0EuY3JsMHQGCCsGAQUFBwEBBGgwZjA+BggrBgEF
// SIG // BQcwAoYyaHR0cDovL2NydC5jb21vZG9jYS5jb20vQ09N
// SIG // T0RPUlNBQ29kZVNpZ25pbmdDQS5jcnQwJAYIKwYBBQUH
// SIG // MAGGGGh0dHA6Ly9vY3NwLmNvbW9kb2NhLmNvbTANBgkq
// SIG // hkiG9w0BAQsFAAOCAQEAl/SePMOyJXzj5+bYGPAjcTh0
// SIG // JjGK6W58hS6RaS/lpXb6ULNZvTFOQRWr/gy0VDR6hClz
// SIG // g2QVvDe0sBTybLcC5J/EUWPJkpq0N8PdUZXqOi9mYtTg
// SIG // af6hl8+LdvUG7gpvNDrqANkh8Vim/4nHWrxXe/xTNveD
// SIG // y1AYYX5BInuFz3NfbrkcrzNrrJgeKTm6M5cDRFm6ZZyR
// SIG // 63W1lEAPaaeEfI7KGqEgDJ963Pa53v7l8PQOXQKr4yfg
// SIG // SMhZfMBqd6W8DNyC6JZBcxfjlZ9UvGRRZgJswGIUwvu9
// SIG // ChXPxQ9wGsH8rn+hKEQRuFElc4ghSumiyTjzS3N92RDy
// SIG // nYFJQuxFYDCCBeAwggPIoAMCAQICEC58h8wOk0pS/pT9
// SIG // HLfNNK8wDQYJKoZIhvcNAQEMBQAwgYUxCzAJBgNVBAYT
// SIG // AkdCMRswGQYDVQQIExJHcmVhdGVyIE1hbmNoZXN0ZXIx
// SIG // EDAOBgNVBAcTB1NhbGZvcmQxGjAYBgNVBAoTEUNPTU9E
// SIG // TyBDQSBMaW1pdGVkMSswKQYDVQQDEyJDT01PRE8gUlNB
// SIG // IENlcnRpZmljYXRpb24gQXV0aG9yaXR5MB4XDTEzMDUw
// SIG // OTAwMDAwMFoXDTI4MDUwODIzNTk1OVowfTELMAkGA1UE
// SIG // BhMCR0IxGzAZBgNVBAgTEkdyZWF0ZXIgTWFuY2hlc3Rl
// SIG // cjEQMA4GA1UEBxMHU2FsZm9yZDEaMBgGA1UEChMRQ09N
// SIG // T0RPIENBIExpbWl0ZWQxIzAhBgNVBAMTGkNPTU9ETyBS
// SIG // U0EgQ29kZSBTaWduaW5nIENBMIIBIjANBgkqhkiG9w0B
// SIG // AQEFAAOCAQ8AMIIBCgKCAQEAppiQY3eRNH+K0d3pZzER
// SIG // 68we/TEds7liVz+TvFvjnx4kMhEna7xRkafPnp4ls1+B
// SIG // qBgPHR4gMA77YXuGCbPj/aJonRwsnb9y4+R1oOU1I47J
// SIG // iu4aDGTH2EKhe7VSA0s6sI4jS0tj4CKUN3vVeZAKFBhR
// SIG // LOb+wRLwHD9hYQqMotz2wzCqzSgYdUjBeVoIzbuMVYz3
// SIG // 1HaQOjNGUHOYXPSFSmsPgN1e1r39qS/AJfX5eNeNXxDC
// SIG // RFU8kDwxRstwrgepCuOvwQFvkBoj4l8428YIXUezg0Hw
// SIG // LgA3FLkSqnmSUs2HD3vYYimkfjC9G7WMcrRI8uPoIfle
// SIG // TGJ5iwIGn3/VCwIDAQABo4IBUTCCAU0wHwYDVR0jBBgw
// SIG // FoAUu69+Aj36pvE8hI6t7jiY7NkyMtQwHQYDVR0OBBYE
// SIG // FCmRYP+KTfrr+aZquM/55ku9Sc4SMA4GA1UdDwEB/wQE
// SIG // AwIBhjASBgNVHRMBAf8ECDAGAQH/AgEAMBMGA1UdJQQM
// SIG // MAoGCCsGAQUFBwMDMBEGA1UdIAQKMAgwBgYEVR0gADBM
// SIG // BgNVHR8ERTBDMEGgP6A9hjtodHRwOi8vY3JsLmNvbW9k
// SIG // b2NhLmNvbS9DT01PRE9SU0FDZXJ0aWZpY2F0aW9uQXV0
// SIG // aG9yaXR5LmNybDBxBggrBgEFBQcBAQRlMGMwOwYIKwYB
// SIG // BQUHMAKGL2h0dHA6Ly9jcnQuY29tb2RvY2EuY29tL0NP
// SIG // TU9ET1JTQUFkZFRydXN0Q0EuY3J0MCQGCCsGAQUFBzAB
// SIG // hhhodHRwOi8vb2NzcC5jb21vZG9jYS5jb20wDQYJKoZI
// SIG // hvcNAQEMBQADggIBAAI/AjnD7vjKO4neDG1NsfFOkk+v
// SIG // wjgsBMzFYxGrCWOvq6LXAj/MbxnDPdYaCJT/JdipiKcr
// SIG // EBrgm7EHIhpRHDrU4ekJv+YkdK8eexYxbiPvVFEtUgLi
// SIG // dQgFTPG3UeFRAMaH9mzuEER2V2rx31hrIapJ1Hw3Tr3/
// SIG // tnVUQBg2V2cRzU8C5P7z2vx1F9vst/dlCSNJH0NXg+p+
// SIG // IHdhyE3yu2VNqPeFRQevemknZZApQIvfezpROYyoH3B5
// SIG // rW1CIKLPDGwDjEzNcweU51qOOgS6oqF8H8tjOhWn1BUb
// SIG // p1JHMqn0v2RH0aofU04yMHPCb7d4gp1c/0a7ayIdiAv4
// SIG // G6o0pvyM9d1/ZYyMMVcx0DbsR6HPy4uo7xwYWMUGd8pL
// SIG // m1GvTAhKeo/io1Lijo7MJuSy2OU4wqjtxoGcNWupWGFK
// SIG // Cpe0S0K2VZ2+medwbVn4bSoMfxlgXwyaiGwwrFIJkBYb
// SIG // /yud29AgyonqKH4yjhnfe0gzHtdl+K7J+IMUk3Z9ZNCO
// SIG // zr41ff9yMU2fnr0ebC+ojwwGUPuMJ7N2yfTm18M04oyH
// SIG // IYZh/r9VdOEhdwMKaGy75Mmp5s9ZJet87EUOeWZo6CLN
// SIG // uO+YhU2WETwJitB/vCgoE/tqylSNklzNwmWYBp7OSFvU
// SIG // tTeTRkF8B93P+kPvumdh/31J4LswfVyA4+YWOUunMIIG
// SIG // VTCCBD2gAwIBAgIKYRhUhgAAAAAAJDANBgkqhkiG9w0B
// SIG // AQUFADB/MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSkwJwYDVQQD
// SIG // EyBNaWNyb3NvZnQgQ29kZSBWZXJpZmljYXRpb24gUm9v
// SIG // dDAeFw0xMTA0MTEyMjA2MjBaFw0yMTA0MTEyMjE2MjBa
// SIG // MIGFMQswCQYDVQQGEwJHQjEbMBkGA1UECBMSR3JlYXRl
// SIG // ciBNYW5jaGVzdGVyMRAwDgYDVQQHEwdTYWxmb3JkMRow
// SIG // GAYDVQQKExFDT01PRE8gQ0EgTGltaXRlZDErMCkGA1UE
// SIG // AxMiQ09NT0RPIFJTQSBDZXJ0aWZpY2F0aW9uIEF1dGhv
// SIG // cml0eTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoC
// SIG // ggIBAJHoVJLSClaxrA0k3cXPRGd0mSs3o30jcABxvFPf
// SIG // xPoqEo9LfxBWvZ9wcrdhf8lLDxenPeOwBGHu/xGXx/SG
// SIG // Pgr6Plz5k+Y0etkUa+ecs4Wggnp2r3GQ1+z9DfqcbPrf
// SIG // sIL0FH75vsSmL09/mX+1/GdDcr0MANaJ62ss0+2PmBwU
// SIG // q37l42782KjkkiTaQ2tiuFX96sG8bLaL8w6NmuSbbGmZ
// SIG // +HhIMEXVreENPEVg/DKWUSe8Z8PKLrZr6kbHxyCgsR9l
// SIG // 3kgIuqROqfKDRjeE6+jMgUhDZ05yKptcvUwbKIpcInu0
// SIG // q5jZ7uBRg8MJRk5tPpn6lRfafDNXQTyNUe0LtlyvLGMa
// SIG // 31fIP7zpXcSbr0WZ4qNaJLS6qVY9z2+q/0lYvvCo//S4
// SIG // rek3+7q49As6+ehDQh6J2ITLE/HZu+GJYLiMKFasFB2c
// SIG // Cudx688O3T2plqFIvTz3r7UNIkzAEYHsVjv206LiW7ey
// SIG // BCJSlYCTaeiOTGXxkQMtcHQC6otnFSlpUgK7199QalVG
// SIG // v6CjKGF/cNDDoqosIapHziicBkV2v4IYJ7TVrrTLUOZr
// SIG // 9EyGcTDppt8WhuDY/0Dd+9BCiH+jMzouXB5BEYFjzhhx
// SIG // ayvspoq3MVw6akfgw3lZ1iAar/JqmKpyvFdK0kuduxD8
// SIG // sExB5e0dPV4onZzMv7NR2qdH5YRTAgMBAAGjgcswgcgw
// SIG // EQYDVR0gBAowCDAGBgRVHSAAMB0GA1UdDgQWBBS7r34C
// SIG // Pfqm8TyEjq3uOJjs2TIy1DALBgNVHQ8EBAMCAYYwDwYD
// SIG // VR0TAQH/BAUwAwEB/zAfBgNVHSMEGDAWgBRi+wohW39D
// SIG // bhHaCVRQa/XSlnHxnjBVBgNVHR8ETjBMMEqgSKBGhkRo
// SIG // dHRwOi8vY3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9w
// SIG // cm9kdWN0cy9NaWNyb3NvZnRDb2RlVmVyaWZSb290LmNy
// SIG // bDANBgkqhkiG9w0BAQUFAAOCAgEAgZgHkv5vMl/Z0kv1
// SIG // fdlx4P38FpIFtM5n9cxL1McQmFT6UhtIWC9zvxnZN6Ct
// SIG // M/NRBSN52bJ3ZIrrvcOznbex5jfR0ll+QdmPsxSrFXdN
// SIG // bNpAJFuyB7hYLEsMK1NRs98uuXasacnC7WQ3e40heszc
// SIG // n7wXKATMJUckKoXMVuY5OYd1GB9G9pEPqkb6TeZHVOIy
// SIG // LHbu+829YuGWJCkGSwz+NErpEB105XovlUvMbrr91zVf
// SIG // keRZQt77AI4I8VFRLWIlhBUIGRGGQGHVJVMjLCl3OMxY
// SIG // 04xfvBm4ZgZMYxDbsqwwbBa8i7zSG8YDExVGpVD0mpaE
// SIG // u3IQONtRmtTFUyfLvygVnghrPT9MwAyRHL8ZhIs3UaAZ
// SIG // nYVVxV2lZHnvEKXr9CMc2m/jLn0XsDd2H02NwQJBHzY+
// SIG // BnvFt2AtQWJR3t3kUS2n3oH0w+Dg6cMWgN2cSX0Xz8tV
// SIG // YwfWaVL0pJ0kjb4byYCZh0VIy0nF7XA1ACZ8pw91Mvft
// SIG // CI/wvKVgoCLVMx775QIslaYH9L4U3nBMjql+Qd6p2VBk
// SIG // hm+UJPer9oOVXQ1F0YwjjAMKE+QOuUMDCkNnsxB0RuRt
// SIG // vWXeRUGGcHIEC7rdulkfVxOTsAvtsRRBadMJBFnHNo59
// SIG // tkud8SD80PGLvWjKPrExz0PQZvWj3a+x3MMXjPoxKMc+
// SIG // SSerahsxghB9MIIQeQIBATCBkjB9MQswCQYDVQQGEwJH
// SIG // QjEbMBkGA1UECBMSR3JlYXRlciBNYW5jaGVzdGVyMRAw
// SIG // DgYDVQQHEwdTYWxmb3JkMRowGAYDVQQKExFDT01PRE8g
// SIG // Q0EgTGltaXRlZDEjMCEGA1UEAxMaQ09NT0RPIFJTQSBD
// SIG // b2RlIFNpZ25pbmcgQ0ECEQDyxbFKM6JAipMKZ9kB44b1
// SIG // MA0GCWCGSAFlAwQCAQUAoHwwEAYKKwYBBAGCNwIBDDEC
// SIG // MAAwGQYJKoZIhvcNAQkDMQwGCisGAQQBgjcCAQQwHAYK
// SIG // KwYBBAGCNwIBCzEOMAwGCisGAQQBgjcCARUwLwYJKoZI
// SIG // hvcNAQkEMSIEIJTZHibAsGCjyiC6QjI43eX6Ora+nwsq
// SIG // UYNEmgRicb71MA0GCSqGSIb3DQEBAQUABIIBAGlsAsdw
// SIG // XJe2z55N6TdUMtBCtem4cV2jG86gORoVJlvybybmhp4L
// SIG // NtiW+VXDSBMs+DnU1HUJj82xBPWX1cUMRsFonyA3qlDr
// SIG // ioOCSUGRer0grMpo0mJiqLGjkmRslp/ruk+5ZJpy5I5b
// SIG // usgnuMhGlMC1y9yyBsi1oZMMOJVFa1/tzEVtOuX7ywa1
// SIG // 7kFay/BvXl3xUX5kkByoMYSHwGzfhEvytM8QjgkoD7RO
// SIG // abV282OoF+vT+4BwhohLQK7th+Q3Th6ITPHnhulgj2Ed
// SIG // BsdcDigbrp1D36fq7w4F8685V78JVFQ4zAM1B36+4ZVU
// SIG // jGQvfRuLrPagufyPVnAbSvO4CXmhgg49MIIOOQYKKwYB
// SIG // BAGCNwMDATGCDikwgg4lBgkqhkiG9w0BBwKggg4WMIIO
// SIG // EgIBAzENMAsGCWCGSAFlAwQCATCCAQ8GCyqGSIb3DQEJ
// SIG // EAEEoIH/BIH8MIH5AgEBBgtghkgBhvhFAQcXAzAxMA0G
// SIG // CWCGSAFlAwQCAQUABCBy8VjOTq/FxIC/y+cVYCxY/tBI
// SIG // SH8o7SAynZtPgJuXHAIVAMxIy6IyBh5IUTjtb3lkLWSw
// SIG // WfYuGA8yMDE3MDgwOTEwMTU1NVowAwIBHqCBhqSBgzCB
// SIG // gDELMAkGA1UEBhMCVVMxHTAbBgNVBAoTFFN5bWFudGVj
// SIG // IENvcnBvcmF0aW9uMR8wHQYDVQQLExZTeW1hbnRlYyBU
// SIG // cnVzdCBOZXR3b3JrMTEwLwYDVQQDEyhTeW1hbnRlYyBT
// SIG // SEEyNTYgVGltZVN0YW1waW5nIFNpZ25lciAtIEcyoIIK
// SIG // izCCBTgwggQgoAMCAQICEHsFsdRJaFFE98mJ0pwZnRIw
// SIG // DQYJKoZIhvcNAQELBQAwgb0xCzAJBgNVBAYTAlVTMRcw
// SIG // FQYDVQQKEw5WZXJpU2lnbiwgSW5jLjEfMB0GA1UECxMW
// SIG // VmVyaVNpZ24gVHJ1c3QgTmV0d29yazE6MDgGA1UECxMx
// SIG // KGMpIDIwMDggVmVyaVNpZ24sIEluYy4gLSBGb3IgYXV0
// SIG // aG9yaXplZCB1c2Ugb25seTE4MDYGA1UEAxMvVmVyaVNp
// SIG // Z24gVW5pdmVyc2FsIFJvb3QgQ2VydGlmaWNhdGlvbiBB
// SIG // dXRob3JpdHkwHhcNMTYwMTEyMDAwMDAwWhcNMzEwMTEx
// SIG // MjM1OTU5WjB3MQswCQYDVQQGEwJVUzEdMBsGA1UEChMU
// SIG // U3ltYW50ZWMgQ29ycG9yYXRpb24xHzAdBgNVBAsTFlN5
// SIG // bWFudGVjIFRydXN0IE5ldHdvcmsxKDAmBgNVBAMTH1N5
// SIG // bWFudGVjIFNIQTI1NiBUaW1lU3RhbXBpbmcgQ0EwggEi
// SIG // MA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC7WZ1Z
// SIG // VU+djHJdGoGi61XzsAGtPHGsMo8Fa4aaJwAyl2pNyWQU
// SIG // Sym7wtkpuS7sY7Phzz8LVpD4Yht+66YH4t5/Xm1AONSR
// SIG // BudBfHkcy8utG7/YlZHz8O5s+K2WOS5/wSe4eDnFhKXt
// SIG // 7a+Hjs6Nx23q0pi1Oh8eOZ3D9Jqo9IThxNF8ccYGKbQ/
// SIG // 5IMNJsN7CD5N+Qq3M0n/yjvU9bKbS+GImRr1wOkzFNbf
// SIG // x4Dbke7+vJJXcnf0zajM/gn1kze+lYhqxdz0sUvUzugJ
// SIG // kV+1hHk1inisGTKPI8EyQRtZDqk+scz51ivvt9jk1R1t
// SIG // ETqS9pPJnONI7rtTDtQ2l4Z4xaE3AgMBAAGjggF3MIIB
// SIG // czAOBgNVHQ8BAf8EBAMCAQYwEgYDVR0TAQH/BAgwBgEB
// SIG // /wIBADBmBgNVHSAEXzBdMFsGC2CGSAGG+EUBBxcDMEww
// SIG // IwYIKwYBBQUHAgEWF2h0dHBzOi8vZC5zeW1jYi5jb20v
// SIG // Y3BzMCUGCCsGAQUFBwICMBkaF2h0dHBzOi8vZC5zeW1j
// SIG // Yi5jb20vcnBhMC4GCCsGAQUFBwEBBCIwIDAeBggrBgEF
// SIG // BQcwAYYSaHR0cDovL3Muc3ltY2QuY29tMDYGA1UdHwQv
// SIG // MC0wK6ApoCeGJWh0dHA6Ly9zLnN5bWNiLmNvbS91bml2
// SIG // ZXJzYWwtcm9vdC5jcmwwEwYDVR0lBAwwCgYIKwYBBQUH
// SIG // AwgwKAYDVR0RBCEwH6QdMBsxGTAXBgNVBAMTEFRpbWVT
// SIG // dGFtcC0yMDQ4LTMwHQYDVR0OBBYEFK9j1sqjToVy4Ke8
// SIG // QfMpojh/gHViMB8GA1UdIwQYMBaAFLZ3+mlIR59TEtXC
// SIG // 6gcydgfRlwcZMA0GCSqGSIb3DQEBCwUAA4IBAQB16rAt
// SIG // 1TQZXDJF/g7h1E+meMFv1+rd3E/zociBiPenjxXmQCmt
// SIG // 5l30otlWZIRxMCrdHmEXZiBWBpgZjV1x8viXvAn9HJFH
// SIG // yeLojQP7zJAv1gpsTjPs1rSTyEyQY0g5QCHE3dZuiZg8
// SIG // tZiX6KkGtwnJj1NXQZAv4R5NTtzKEHhsQm7wtsX4YVxS
// SIG // 9U72a433Snq+8839A9fZ9gOoD+NT9wp17MZ1LqpmhQSZ
// SIG // t/gGV+HGDvbor9rsmxgfqrnjOgC/zoqUywHbnsc4uw9S
// SIG // q9HjlANgCk2g/idtFDL8P5dA4b+ZidvkORS92uTTw+or
// SIG // WrOVWFUEfcea7CMDjYUq0v+uqWGBMIIFSzCCBDOgAwIB
// SIG // AgIQVFjyqtdB1kS8hKl7oJZS5jANBgkqhkiG9w0BAQsF
// SIG // ADB3MQswCQYDVQQGEwJVUzEdMBsGA1UEChMUU3ltYW50
// SIG // ZWMgQ29ycG9yYXRpb24xHzAdBgNVBAsTFlN5bWFudGVj
// SIG // IFRydXN0IE5ldHdvcmsxKDAmBgNVBAMTH1N5bWFudGVj
// SIG // IFNIQTI1NiBUaW1lU3RhbXBpbmcgQ0EwHhcNMTcwMTAy
// SIG // MDAwMDAwWhcNMjgwNDAxMjM1OTU5WjCBgDELMAkGA1UE
// SIG // BhMCVVMxHTAbBgNVBAoTFFN5bWFudGVjIENvcnBvcmF0
// SIG // aW9uMR8wHQYDVQQLExZTeW1hbnRlYyBUcnVzdCBOZXR3
// SIG // b3JrMTEwLwYDVQQDEyhTeW1hbnRlYyBTSEEyNTYgVGlt
// SIG // ZVN0YW1waW5nIFNpZ25lciAtIEcyMIIBIjANBgkqhkiG
// SIG // 9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmfP82AQJA4b511ym
// SIG // k8BCfOp8Y89dAOKO88CQ348p9RjqlLeS5dewoHOB6OkK
// SIG // m0p8Af+dj6Q5pw7qRfQiDDpw7TlFi+TFG1zwRWhGJAVj
// SIG // dpsc/J5sKrFW5Yp/UnGu8jXVRiMGHM9ILR20zbjZdiOO
// SIG // HP8+v7sGXGkHpmUO+F6ufS7tTa4178nXAEL9KJUOn11y
// SIG // Qgm8w9pE0u3MR4Tk/MotrFi+rveu2UQNCLfCd9YaQ3DR
// SIG // bgPeUpLEEAhx2boiVfIfvO2bnTviXh1Mg/+XD3sL51WD
// SIG // TtIN677X7K5uR7mf36XWUbwEVe3/J3BMye0qSxPhsblM
// SIG // D8kB7lVlX2kCeGbLPwIDAQABo4IBxzCCAcMwDAYDVR0T
// SIG // AQH/BAIwADBmBgNVHSAEXzBdMFsGC2CGSAGG+EUBBxcD
// SIG // MEwwIwYIKwYBBQUHAgEWF2h0dHBzOi8vZC5zeW1jYi5j
// SIG // b20vY3BzMCUGCCsGAQUFBwICMBkaF2h0dHBzOi8vZC5z
// SIG // eW1jYi5jb20vcnBhMEAGA1UdHwQ5MDcwNaAzoDGGL2h0
// SIG // dHA6Ly90cy1jcmwud3Muc3ltYW50ZWMuY29tL3NoYTI1
// SIG // Ni10c3MtY2EuY3JsMBYGA1UdJQEB/wQMMAoGCCsGAQUF
// SIG // BwMIMA4GA1UdDwEB/wQEAwIHgDB3BggrBgEFBQcBAQRr
// SIG // MGkwKgYIKwYBBQUHMAGGHmh0dHA6Ly90cy1vY3NwLndz
// SIG // LnN5bWFudGVjLmNvbTA7BggrBgEFBQcwAoYvaHR0cDov
// SIG // L3RzLWFpYS53cy5zeW1hbnRlYy5jb20vc2hhMjU2LXRz
// SIG // cy1jYS5jZXIwKAYDVR0RBCEwH6QdMBsxGTAXBgNVBAMT
// SIG // EFRpbWVTdGFtcC0yMDQ4LTUwHQYDVR0OBBYEFAm1wf6W
// SIG // cpcpQ5rJ4AK6rvj9L7r2MB8GA1UdIwQYMBaAFK9j1sqj
// SIG // ToVy4Ke8QfMpojh/gHViMA0GCSqGSIb3DQEBCwUAA4IB
// SIG // AQAXswqI6VxaXiBrOwoVsmzFqYoyh9Ox9BxTroW+P5v/
// SIG // 17y3lIW0x1J+lOi97WGy1KeZ5MPJk8E1PQvoaApdVpi9
// SIG // sSI70UR617/wbVEyitUj3zgBN/biUyt6KxGPt01sejMD
// SIG // G3xrCZQXu+TbWNQhE2Xn7NElyix1mpx//Mm7KmirxH20
// SIG // z6PJbKfZxACciQp3kfRNovsxO4Zu9uYfUAOGm7/LQqvm
// SIG // dptyWhEBisbvpW+V592uuuYiZfAYWRsRyc2At9iXRx9C
// SIG // CPiscR+wRlOz1LLVo6tQdUgSF4Ktz+BBTzJ+zZUcv5GK
// SIG // CD2kp2cClt8kTKXQQcCCYKOKFzJL07zPpLSMMYICWjCC
// SIG // AlYCAQEwgYswdzELMAkGA1UEBhMCVVMxHTAbBgNVBAoT
// SIG // FFN5bWFudGVjIENvcnBvcmF0aW9uMR8wHQYDVQQLExZT
// SIG // eW1hbnRlYyBUcnVzdCBOZXR3b3JrMSgwJgYDVQQDEx9T
// SIG // eW1hbnRlYyBTSEEyNTYgVGltZVN0YW1waW5nIENBAhBU
// SIG // WPKq10HWRLyEqXugllLmMAsGCWCGSAFlAwQCAaCBpDAa
// SIG // BgkqhkiG9w0BCQMxDQYLKoZIhvcNAQkQAQQwHAYJKoZI
// SIG // hvcNAQkFMQ8XDTE3MDgwOTEwMTU1NVowLwYJKoZIhvcN
// SIG // AQkEMSIEIK/K5vuLMDwnYFXo+ckj/6fqSMCmht4ivqPD
// SIG // 7z2j56zLMDcGCyqGSIb3DQEJEAIvMSgwJjAkMCIEIM96
// SIG // wXrQR+zV/cNoIgMbEtTvB4tvK0xea6Qfj/LPS61nMAsG
// SIG // CSqGSIb3DQEBAQSCAQCMOCUpdhPuy4JlVdFpy60br1am
// SIG // GfBzBMjy5yJofQ1DM7XCH3H6TwlEy8ysrDKvrQ15buIc
// SIG // 2u3t37ElU7urTsEInYGJ4N39dqsm2BsGC2eML5Jx1C1e
// SIG // X6wvoyi/dH5umkiKN9Jn+vgv3Vb/W3D2iC0rIpFUN/Ui
// SIG // zALv6Ol0MvTPVHWaIwm+PuG1trUNYX4JGCQeU5gAlED4
// SIG // RNRBpE33V1gdXQv6CXdhmA6DusooJg0fkAoXXpGiI4e2
// SIG // Qqn30DclY0xkpJ2u+kSrBi5cR48gJx/uCxG8nVLJjL1A
// SIG // 51hcx/N2oDS6z36O2qshY4Kn3uowod5jceML1C/dsyq6
// SIG // RLwagAsZ
// SIG // End signature block
