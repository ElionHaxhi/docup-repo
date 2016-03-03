/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.docup.model;

import java.io.Serializable;
import java.util.List;
import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

/**
 *
 * @author elion
 */
@Entity
@Table(name = "personal_info")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "PersonalInfo.findAll", query = "SELECT p FROM PersonalInfo p"),
    @NamedQuery(name = "PersonalInfo.findById", query = "SELECT p FROM PersonalInfo p WHERE p.id = :id"),
    @NamedQuery(name = "PersonalInfo.findByName", query = "SELECT p FROM PersonalInfo p WHERE p.name = :name"),
    @NamedQuery(name = "PersonalInfo.findBySurname", query = "SELECT p FROM PersonalInfo p WHERE p.surname = :surname"),
    @NamedQuery(name = "PersonalInfo.findByAddress", query = "SELECT p FROM PersonalInfo p WHERE p.address = :address"),
    @NamedQuery(name = "PersonalInfo.findByEmail", query = "SELECT p FROM PersonalInfo p WHERE p.email = :email"),
    @NamedQuery(name = "PersonalInfo.findByCellphone", query = "SELECT p FROM PersonalInfo p WHERE p.cellphone = :cellphone"),
    @NamedQuery(name = "PersonalInfo.findByTelephone", query = "SELECT p FROM PersonalInfo p WHERE p.telephone = :telephone")})
public class PersonalInfo implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @Column(name = "name")
    private String name;
    @Basic(optional = false)
    @Column(name = "surname")
    private String surname;
    @Column(name = "address")
    private String address;
    @Column(name = "email")
    private String email;
    @Column(name = "cellphone")
    private String cellphone;
    @Column(name = "telephone")
    private String telephone;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "personalInfoId")
    private List<Doctor> doctorList;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "personalInfoId")
    private List<Patient> patientList;

    public PersonalInfo() {
    }

    public PersonalInfo(Integer id) {
        this.id = id;
    }

    public PersonalInfo(Integer id, String name, String surname) {
        this.id = id;
        this.name = name;
        this.surname = surname;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCellphone() {
        return cellphone;
    }

    public void setCellphone(String cellphone) {
        this.cellphone = cellphone;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    @XmlTransient
    public List<Doctor> getDoctorList() {
        return doctorList;
    }

    public void setDoctorList(List<Doctor> doctorList) {
        this.doctorList = doctorList;
    }

    @XmlTransient
    public List<Patient> getPatientList() {
        return patientList;
    }

    public void setPatientList(List<Patient> patientList) {
        this.patientList = patientList;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof PersonalInfo)) {
            return false;
        }
        PersonalInfo other = (PersonalInfo) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.docup.model.PersonalInfo[ id=" + id + " ]";
    }
    
}
