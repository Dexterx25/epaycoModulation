"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
function Validator(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('THIS IS DATA VALIDATOR--->', data);
        const { names, surnames, prefix_number, phone_number, password, date_birtday, password_verification, weight, height } = data;
        let full_name = `${names} ${surnames}`;
        if (data.email) {
            const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (data.email.length > 300)
                return "El correo no debe superar los 300 caracteres!";
            if (emailRegex.test(data.email) == false)
                return "El Correo no presenta un formato valido de correo";
        }
        else {
            return 'Es necesario suministrar un correo';
        }
        if (prefix_number) {
            function regexValidator(valor) {
                console.log('vall-->', valor);
                const patron = /[áéíóúñÑÄËÏÖÜÂÊÎÔÛáàèìòù]/;
                const patron2 = /^[A-Z]+$/i;
                if (patron.test(valor) == true) {
                    console.log('error Acents');
                    return 'No se aceptan acentos ni "ñ" en indicativo telefónico';
                }
                else if (patron2.test(valor) == true) {
                    console.log('Error Alphabetic');
                    return 'No se permiten letras del alfabeto, solo "+" o "-" seguido el numero indicativo';
                }
                else {
                    return '';
                }
            }
            for (let i = 0; i < prefix_number.length; i++) {
                const character = prefix_number.charAt(i);
                const regex = yield regexValidator(character);
                if (regex) {
                    return regex;
                }
            }
            if (prefix_number !== '+57')
                return 'Por el momento es necesario que sea de indicatívo colombia';
            if (prefix_number)
                return '';
        }
        else {
            return 'Es necesario que haya número indicativo';
        }
        if (phone_number) {
            function regexValidator(valor) {
                console.log('vall-->', valor);
                const patron = /[áéíóúñÑÄËÏÖÜÂÊÎÔÛáàèìòù]/;
                const patron2 = /^[A-Z_ | \w+( \w+)]+$/;
                if (patron.test(valor) == true) {
                    console.log('error Acents');
                    return 'No se aceptan acentos ni "ñ" en númoero telefónico';
                }
                else if (patron2.test(valor) == true) {
                    console.log('Error Alphabetic');
                    return 'No se permiten letras del alfabeto';
                }
                else {
                    return '';
                }
            }
            for (let i = 0; i < phone_number.length; i++) {
                const character = phone_number.charAt(i);
                const regex = yield regexValidator(character);
                if (regex) {
                    return regex;
                }
            }
            if (phone_number.length !== 10)
                return 'El número telefónico no puede ser mayor o menor a 19 dígitos';
        }
        else {
            return 'Es necesario suministrar un número de teléfono';
        }
        if (height.length) {
            if (height.length > 4 || height.includes('-') || height.includes(','))
                return 'La estatura no es váida';
        }
        else {
            return 'Es necesario suministrar la estatura';
        }
        if (weight) {
            if (weight.length > 3)
                return 'El peso soministrado no es válido';
        }
        else {
            return 'Es necesario suministrar el peso';
        }
        if (password) {
            if (password.length < 8)
                return 'La contraseña debe ser mayor o igual a 8 caractéres';
            if (password !== password_verification)
                return 'La cantraseña y la contraseña de verificación no son iguales, deben ser iguales';
            function regexValidator(valor) {
                console.log('vall-->', valor);
                const patron = /[áéíóúñÑÄËÏÖÜÂÊÎÔÛáàèìòù]/;
                const patron2 = /^[0-9]{4,}$/;
                if (patron.test(valor) == true) {
                    console.log('error Acents');
                    return 'No se aceptan acentos ni "ñ" en contraseña';
                }
                else if (patron2.test(valor) == true) {
                    console.log('Error Alphabetic');
                    return 'No se permiten más de 4 digitos consecutivos';
                }
                else {
                    return '';
                }
            }
            for (let i = 0; i < password.length; i++) {
                const character = password.charAt(i);
                const regex = yield regexValidator(character);
                if (regex) {
                    return regex;
                }
            }
        }
        else {
            return 'Es necesario suministrar una contraseña';
        }
        if (names.length || surnames.length) {
            if (full_name) {
                if (names.length > 20)
                    return 'Los nombres no pueden ocupar más de 20 caracteres';
                if (surnames.length > 20)
                    return 'Los apellidos no pueden ocupar más de 20 caracteres';
                function regexValidator(valor) {
                    console.log('vall-->', valor);
                    const patron = /[áéíóúñÑÄËÏÖÜÂÊÎÔÛáàèìòù]/;
                    const patron2 = /^[A-Z_ | \w+( \w+)]+$/;
                    if (patron.test(valor) == true) {
                        console.log('error Acents');
                        return 'No se aceptan acentos ni "ñ" en nombres ni apellidos';
                    }
                    else if (patron2.test(valor) == false) {
                        console.log('Error Alphabetic');
                        return 'Todas las letras deben ser del alfabeto';
                    }
                    else {
                        return '';
                    }
                }
                for (let i = 0; i < full_name.length; i++) {
                    const character = full_name.charAt(i);
                    const regex = yield regexValidator(character);
                    if (regex) {
                        return regex;
                    }
                }
            }
            else if (full_name.includes('ñ') || full_name.includes('Ñ')) {
                return 'El nombre completo no debe tener "ñ" ';
            }
            else {
                return '';
            }
        }
        else {
            return 'El primer nombre y el primer y segundo apellido deben llenarse';
        }
    });
}
exports.Validator = Validator;
//# sourceMappingURL=validator.js.map