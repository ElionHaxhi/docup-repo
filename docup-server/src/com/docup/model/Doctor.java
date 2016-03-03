/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.docup.model;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

/**
 *
 * @author elion
 */
@Entity
@Table(name = "doctor")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Doctor.findAll", query = "SELECT d FROM Doctor d"),
    @NamedQuery(name = "Doctor.findById", query = "SELECT d FROM Doctor d WHERE d.id = :id"),
    @NamedQuery(name = "Doctor.findByUsername", query = "SELECT d FROM Doctor d WHERE d.username = :username"),
    @NamedQuery(name = "Doctor.findByPassword", query = "SELECT d FROM Doctor d WHERE d.password = :password"),
    @NamedQuery(name = "Doctor.findByTrash", query = "SELECT d FROM Doctor d WHERE d.trash = :trash"),
    @NamedQuery(name = "Doctor.findByTrashDate", query = "SELECT d FROM Doctor d WHERE d.trashDate = :trashDate"),
    @NamedQuery(name = "Doctor.findByRegistrationDate", query = "SELECT d FROM Doctor d WHERE d.registrationDate = :registrationDate")})
public class Doctor implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @Column(name = "username")
    private String username;
    @Basic(optional = false)
    @Column(name = "password")
    private String password;
    @Basic(optional = false)
    @Column(name = "trash")
    private boolean trash;
    @Column(name = "trash_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date trashDate;
    @Column(name = "registration_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date registrationDate;
    @JoinTable(name = "doctor_has_patient", joinColumns = {
        @JoinColumn(name = "doctor_id", referencedColumnName = "id")}, inverseJoinColumns = {
        @JoinColumn(name = "patient_id", referencedColumnName = "id")})
    @ManyToMany
    private List<Patient> patientList;
    @JoinColumn(name = "personal_info_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private PersonalInfo personalInfoId;

    public Doctor() {
    }

    public Doctor(Integer id) {
        this.id = id;
    }

    public Doctor(Integer id, String username, String password, boolean trash) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.trash = trash;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean getTrash() {
        return trash;
    }

    public void setTrash(boolean trash) {
        this.trash = trash;
    }

    public Date getTrashDate() {
        return trashDate;
    }

    public void setTrashDate(Date trashDate) {
        this.trashDate = trashDate;
    }

    public Date getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(Date registrationDate) {
        this.registrationDate = registrationDate;
    }

    @XmlTransient
    public List<Patient> getPatientList() {
        return patientList;
    }

    public void setPatientList(List<Patient> patientList) {
        this.patientList = patientList;
    }

    public PersonalInfo getPersonalInfoId() {
        return personalInfoId;
    }

    public void setPersonalInfoId(PersonalInfo personalInfoId) {
        this.personalInfoId = personalInfoId;
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
        if (!(object instanceof Doctor)) {
            return false;
        }
        Doctor other = (Doctor) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.docup.model.Doctor[ id=" + id + " ]";
    }
    
}
